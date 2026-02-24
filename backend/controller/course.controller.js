import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Course } from "../model/course.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Instructor } from "../model/instructor.model.js";
import { BankAccount } from "../model/bankAccount.model.js";
import { Transaction } from "../model/transaction.model.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


// ═══════════════════════════════════════════════════════════
// COURSE CREATION - Instructor creates a new course
// ═══════════════════════════════════════════════════════════
// DEMONSTRATION FLOW:
// 1. Validate instructor has bank account (required to receive payments)
// 2. Validate course info (title, description, price)
// 3. Upload media files to Cloudinary (thumbnail + videos)
// 4. Process additional resources (links, documents, etc.)
// 5. Create Course document in database
// 6. Link course to instructor's courses_taught array
// ═══════════════════════════════════════════════════════════
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, lumpSumPayment } = req.body;
  const instructorId = req.body.instructor || req.user._id; // From JWT auth

  // STEP 1: Fetch and validate instructor
  const instructor = await Instructor.findById(instructorId);
  if (!instructor) {
    throw new ApiError(404, "Instructor not found");
  }

  // CRITICAL: Instructor MUST have bank account to receive course payments
  // Without this, learners cannot enroll (payment would fail)
  if (!instructor.bank_account_number || !instructor.bank_secret) {
    throw new ApiError(
      403,
      "Cannot create course. Instructor must have a linked bank account."
    );
  }

  const instructorBank = await BankAccount.findOne({
    account_number: instructor.bank_account_number,
  });
  if (!instructorBank) {
    throw new ApiError(403, "Instructor bank account not found");
  }
  if (instructorBank.secret_key !== instructor.bank_secret) {
    throw new ApiError(403, "Instructor bank account credentials mismatch");
  }

  // STEP 2: Validate required course information
  if ([title, description, price].some(field => !field || field.toString().trim() === "")) {
    throw new ApiError(400, "Title, description, and price are required");
  }

  const resolvedLumpSumPayment =
    lumpSumPayment !== undefined && lumpSumPayment !== null && lumpSumPayment !== ""
      ? lumpSumPayment
      : price;

  const parseArrayField = (value, fieldName) => {
    if (value === undefined || value === null || value === "") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {
        // handled below with unified error
      }
    }
    throw new ApiError(400, `${fieldName} must be a valid JSON array`);
  };

  const videoFiles = Array.isArray(req.files?.files)
    ? req.files.files
    : Array.isArray(req.files)
      ? req.files
      : [];
  const resourceFiles = Array.isArray(req.files?.resourceFiles)
    ? req.files.resourceFiles
    : [];
  const thumbnailFile = req.files?.thumbnail?.[0] || null;

  // STEP 3: Validate video files (at least one required)
  // Videos are the main course content that learners will watch
  if (!videoFiles.length) {
    throw new ApiError(400, "At least one video file is required");
  }

  const videoTitles = parseArrayField(req.body.videoTitles, "videoTitles");
  const videoDurations = parseArrayField(req.body.videoDurations, "videoDurations");
  const studyMaterialTitles = parseArrayField(req.body.resourceTitles, "resourceTitles");

  // STEP 4: Upload files to Cloudinary (cloud storage)
  // All uploads happen in parallel for better performance
  const [uploadResults, thumbnailUpload, resourceUploadResults] = await Promise.all([
    Promise.all(videoFiles.map(file => uploadCloudinary(file.path))),
    thumbnailFile ? uploadCloudinary(thumbnailFile.path) : null,
    Promise.all(resourceFiles.map(file => uploadCloudinary(file.path))),
  ]);

  if (uploadResults.some((result) => !result?.secure_url)) {
    throw new ApiError(500, "Failed to upload one or more videos");
  }
  if (resourceUploadResults.some((result) => !result?.secure_url)) {
    throw new ApiError(500, "Failed to upload one or more study materials");
  }

  const thumbnail = thumbnailUpload?.secure_url || null;

  // Build video objects with Cloudinary URLs
  // Each video includes: title, URL (from Cloudinary), duration
  const videos = uploadResults.map((result, index) => ({
    title: videoTitles[index]?.trim() || `Video ${index + 1}`,
    url: result.secure_url,                    // Cloudinary URL
    duration_seconds: parseInt(videoDurations[index]) || 60
  }));

  // STEP 5: Process additional resources (optional)
  // Resources can be: images, documents, links, audio files, MCQs
  const allowedResourceTypes = ["image", "text", "mcq", "audio", "document_link", "file"];
  let resources = parseArrayField(req.body.resources, "resources")
    .map((resource) => ({
      title: resource?.title?.trim(),
      mediaType: resource?.mediaType?.trim(),
      url: resource?.url?.trim(),
    }))
    .filter((resource) => resource.title || resource.mediaType || resource.url);

  resources.forEach((resource, index) => {
    if (!resource.title || !resource.mediaType || !resource.url) {
      throw new ApiError(400, `Resource ${index + 1}: title, mediaType, and url are required`);
    }
    if (!allowedResourceTypes.includes(resource.mediaType)) {
      throw new ApiError(400, `Invalid mediaType in resource ${index + 1}`);
    }
  });

  const fileResources = resourceUploadResults.map((result, index) => ({
    title:
      studyMaterialTitles[index]?.toString().trim() ||
      resourceFiles[index]?.originalname ||
      `Study Material ${index + 1}`,
    mediaType: "file",
    url: result.secure_url,
  }));
  resources = [...resources, ...fileResources];

  // STEP 6: Create Course document in database
  // Course is now visible to all users for browsing/enrollment
  const course = await Course.create({
    title,
    description,
    price: Number(price),                      // Per-video price
    lumpSumPayment: Number(resolvedLumpSumPayment),  // Full course price
    instructor: instructor._id,                // Link to instructor
    thumbnail,                                 // Course cover image
    videos,                                    // Video lectures
    resources                                  // Additional materials
  });

  // STEP 7: Link course to instructor's profile
  // This allows instructor to see/manage their courses
  await Instructor.findByIdAndUpdate(
    instructor._id,
    { $push: { courses_taught: course._id } },
    { new: true }
  );

  return res.status(201).json(
    new ApiResponse(201, course, "Course created successfully")
  );
});

export default createCourse;


// course.controller.js

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find()
        .populate("instructor", "fullName userName")
        .select("title description price videos thumbnail createdAt");

    const result = await Promise.all(
        courses.map(async (course) => {
            const enrolled = await Transaction.countDocuments({
                course_id: course._id,
                status: "COMPLETED"
            });
            
    return {
    _id: course._id,
    title: course.title,
    description: course.description,
    price: course.price,
    totalVideos: course.videos.length,
    enrolledStudents: enrolled,
    instructor: course.instructor
        ? { name: course.instructor.fullName, username: course.instructor.userName }
        : null, // or { name: "Unknown", username: "Unknown" }
    thumbnail: course.thumbnail || course.videos[0]?.url || null
    };

        })
    );

    res.json(new ApiResponse(200, result));
});

const getCoursePublicDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId)
    .populate("instructor", "fullName userName email")
    .select("title description price lumpSumPayment videos resources thumbnail instructor createdAt");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const enrolled = await Transaction.countDocuments({
    course_id: course._id,
    status: "COMPLETED",
  });

  const payload = {
    _id: course._id,
    title: course.title,
    description: course.description,
    price: course.price,
    lumpSumPayment: course.lumpSumPayment,
    enrolledStudents: enrolled,
    instructor: course.instructor
      ? {
          name: course.instructor.fullName,
          username: course.instructor.userName,
          email: course.instructor.email,
        }
      : null,
    thumbnail: course.thumbnail || course.videos[0]?.url || null,
    videoCount: course.videos.length,
    resourceCount: course.resources.length,
    createdAt: course.createdAt,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Course details fetched"));
});



// ==================== ADD VIDEOS ONLY ====================
const addVideosToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user._id;

  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new ApiError(404, "Course not found or unauthorized");

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Please upload at least one video");
  }

  const videoTitles = typeof req.body.videoTitles === "string" ? JSON.parse(req.body.videoTitles) : req.body.videoTitles || [];
  const videoDurations = typeof req.body.videoDurations === "string" ? JSON.parse(req.body.videoDurations) : req.body.videoDurations || [];

  const uploadResults = await Promise.all(req.files.map(file => uploadCloudinary(file.path)));

  const newVideos = uploadResults.map((result, i) => ({
    title: videoTitles[i]?.trim() || `New Lecture ${course.videos.length + i + 1}`,
    url: result.secure_url,
    duration_seconds: parseInt(videoDurations[i]) || 60
  }));

  course.videos.push(...newVideos);
  await course.save();

  return res.status(200).json(new ApiResponse(200, { added: newVideos.length, total: course.videos.length }, "Videos added successfully"));
});

// ==================== ADD RESOURCES ONLY ====================
const addResourcesToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user._id;

  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new ApiError(404, "Course not found or unauthorized");

  const uploadedFiles = Array.isArray(req.files) ? req.files : [];
  let resources = [];

  if (req.body.resources) {
    resources = typeof req.body.resources === "string" ? JSON.parse(req.body.resources) : req.body.resources;
    if (!Array.isArray(resources)) throw new ApiError(400, "resources must be an array");

    resources.forEach((r, i) => {
      if (!r.title || !r.mediaType || !r.url) throw new ApiError(400, `Resource ${i + 1} incomplete`);
      if (!["image", "text", "mcq", "audio", "document_link", "file"].includes(r.mediaType)) {
        throw new ApiError(400, `Invalid mediaType: ${r.mediaType}`);
      }
    });
  }

  const fileResources = uploadedFiles.length
    ? await Promise.all(
        uploadedFiles.map(async (file, index) => {
          const result = await uploadCloudinary(file.path);
          if (!result?.secure_url) throw new ApiError(500, "Failed to upload resource file");
          return {
            title: file.originalname || `Resource ${course.resources.length + index + 1}`,
            mediaType: "file",
            url: result.secure_url,
          };
        })
      )
    : [];

  const mergedResources = [...resources, ...fileResources];
  if (!mergedResources.length) {
    throw new ApiError(400, "resources field is required or provide files to upload");
  }

  course.resources.push(...mergedResources);
  await course.save();

  return res.status(200).json(new ApiResponse(200, { added: mergedResources.length, total: course.resources.length }, "Resources added successfully"));
});

// ==================== DELETE VIDEO ====================


// ==================== DELETE RESOURCE ====================
const deleteItem = asyncHandler(async (req, res) => {



  const { courseId, itemId } = req.params;
  const instructorId = req.user._id;

  const course = await Course.findOne({ _id: courseId, instructor: instructorId });
  if (!course) throw new ApiError(404, "Course not found or unauthorized");


  // --- 1. Try deleting from resources ---
  let resourceIndex = course.resources.findIndex(r => r._id.toString() === itemId);
  if (resourceIndex !== -1) {
    course.resources.splice(resourceIndex, 1);
    await course.save();
    return res.status(200).json(new ApiResponse(200, null, "Resource deleted successfully"));
  }

  // --- 2. Try deleting from videos ---
  let videoIndex = course.videos.findIndex(v => v._id.toString() === itemId);
  if (videoIndex !== -1) {
    course.videos.splice(videoIndex, 1);
    await course.save();
    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
  }

  // If neither matches
  throw new ApiError(404, "No video or resource found with this ID");
});
// ==================== DELETE RESOURCE ====================

//most view course

const getMostViewedCourses = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  // Step 1: Try to get most enrolled
  let topCourses = await Course.aggregate([
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "course_id",
        as: "enrollments"
      }
    },
    {
      $addFields: {
        enrolledCount: { $size: "$enrollments" },
        thumbnail: { $arrayElemAt: ["$videos.url", 0] }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor"
      }
    },
    { $unwind: "$instructor" },
    {
      $project: {
        title: 1,
        description: 1,
        price: 1,
        thumbnail: 1,
        enrolledCount: 1,
        "instructor.fullName": 1
      }
    },
    { $sort: { enrolledCount: -1 } },
    { $limit: limit }
  ]);

  // Step 2: If no one enrolled → show random 4 courses
  if (topCourses.length === 0 || topCourses.every(c => c.enrolledCount === 0)) {
    topCourses = await Course.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor"
        }
      },
      { $unwind: "$instructor" },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          thumbnail: { $arrayElemAt: ["$videos.url", 0] },
          "instructor.fullName": 1
        }
      },
      { $sample: { size: 4 } } // MongoDB এর built-in random
    ]);
  }

  return res.status(200).json(
    new ApiResponse(200, topCourses, "Top courses fetched")
  );
});


// course.controller.js

const getCoursesByCategory = asyncHandler(async (req, res) => {
  const grouped = await Course.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor"
      }
    },
    { $unwind: "$instructor" },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "course_id",
        as: "enrollments"
      }
    },
    {
      $addFields: {
        enrolledCount: { $size: "$enrollments" },
        thumbnail: { $arrayElemAt: ["$videos.url", 0] }
      }
    },
    {
      $project: {
        title: 1,
        description: 1,
        price: 1,
        thumbnail: 1,
        enrolledCount: 1,
        "instructor.fullName": 1,
        "instructor.userName": 1
      }
    },
    {
      $group: {
        _id: "$title",  // এখানে title = category
        courses: { $push: "$$ROOT" },
        totalCourses: { $sum: 1 },
        totalEnrollments: { $sum: "$enrolledCount" }
      }
    },
    {
      $sort: { totalEnrollments: -1 } // সবচেয়ে পপুলার ক্যাটাগরি আগে
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, grouped, "Courses grouped by category")
  );
});



export {
  createCourse,
  getAllCourses,
  getCoursePublicDetails,
  addVideosToCourse,
  addResourcesToCourse,
  deleteItem,
  getMostViewedCourses,
  getCoursesByCategory,
};
