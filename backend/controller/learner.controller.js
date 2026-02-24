// learner.controller.js

import { Course } from "../model/course.model.js";
import { Transaction } from "../model/transaction.model.js";
import { Learner } from "../model/learner.model.js";
import { BankAccount } from "../model/bankAccount.model.js";
import { executeImmediatePayment } from "./bank.controller.js";  // নতুন ফাংশন
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ═══════════════════════════════════════════════════════════
// COURSE ENROLLMENT - Most Complex Flow in the System
// ═══════════════════════════════════════════════════════════
// DEMONSTRATION FLOW:
// 1. Validate course exists & instructor has bank account
// 2. Check learner not already enrolled
// 3. Execute payment (80% to instructor, 20% to admin)
// 4. Create transaction record
// 5. Add course to learner's enrolled list
// 6. Update instructor's earnings
// ═══════════════════════════════════════════════════════════
export const enrollInCourse = asyncHandler(async (req, res) => {
    const { courseId, bankAccountNumber, secretKey } = req.body;
    const learnerId = req.user._id; // From JWT middleware

    // STEP 1: Validate course and instructor
    const course = await Course.findById(courseId).populate("instructor");
    if (!course) throw new ApiError(404, "Course not found");
    // CRITICAL: Instructor must have bank account to receive payment
    if (!course.instructor || !course.instructor.bank_account_number) {
        throw new ApiError(400, "Instructor has no bank account linked for this course");
    }

    // STEP 2: Prevent duplicate enrollment
    const learner = await Learner.findById(learnerId);
    const already = learner.courses_enrolled.find(
        e => e.course.toString() === courseId && e.status !== "Rejected"
    );

    if (already) {
        throw new ApiError(400, "Already enrolled in this course");
    }

    // STEP 3: Validate instructor's bank account exists
    const instructorBank = await BankAccount.findOne({
        account_number: course.instructor.bank_account_number,
    });
    if (!instructorBank) {
        throw new ApiError(400, "Instructor bank account not found");
    }

    // STEP 4: Execute payment (CRITICAL OPERATION)
    // This function handles:
    // - Validating learner's bank credentials
    // - Checking sufficient balance
    // - Splitting payment: 80% instructor, 20% admin
    // - Updating all bank account balances
    await executeImmediatePayment({
        learnerId,
        learnerBankAccount: bankAccountNumber,
        secretKey,
        instructorBankAccount: course.instructor.bank_account_number,
        amount: course.price
    });

    // STEP 5: Record transaction for audit trail
    // Transaction is created as COMPLETED since payment already executed
    const transaction = await Transaction.create({
        type: "PURCHASE",           // Type of transaction
        amount: course.price,        // Full course price (before split)

        from_user: learnerId,        // Learner (payer)
        from_account_number: bankAccountNumber,

        to_user: course.instructor._id,  // Instructor (receiver)
        to_account_number: course.instructor.bank_account_number,

        status: "COMPLETED",         // Already processed
        course_id: courseId          // Link to course
    });

    // STEP 6: Grant course access to learner
    // Status: "InProgress" = immediate full access to course content
    learner.courses_enrolled.push({
        course: courseId,
        status: "InProgress",      // Can watch videos immediately
        progress_percentage: 0      // Will update as videos watched
    });

    await learner.save();

    res.status(201).json(new ApiResponse(201, {
        message: "Payment successful! Full access granted.",
        transactionId: transaction._id
    }));
});



// 1. Get all enrolled courses with status & progress
export const getMyCourses = asyncHandler(async (req, res) => {
    const learner = await Learner.findById(req.user._id)
        .populate({
            path: "courses_enrolled.course",
            populate: { path: "instructor", select: "fullName" }
        });

    const courses = learner.courses_enrolled.map(en => {
        const course = en.course;
        const totalDuration = course.videos.reduce((sum, v) => sum + v.duration_seconds, 0);
        const watchedDuration = en.watch_history.reduce((sum, wh) => {
            const video = course.videos.find(v => v._id.toString() === wh.material_id.toString());
            return sum + (wh.last_watched_time > video?.duration_seconds ? video.duration_seconds : wh.last_watched_time);
        }, 0);
        const progress = totalDuration > 0 ? Math.round((watchedDuration / totalDuration) * 100) : 0;

        return {
            courseId: course._id,
            title: course.title,
            description: course.description,
            price: course.price,
            instructorName: course.instructor.fullName,
            status: en.status,
            progress_percentage: progress,
            enrolledAt: en.enrollment_date
        };
    });

    res.json(new ApiResponse(200, courses));
});


// 2. Get full course content of a specific enrolled course
// 2. Get full course content of a specific enrolled course
export const getCourseContent = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const learner = await Learner.findById(req.user._id);

    const enrollment = learner.courses_enrolled.find(
        en => en.course.toString() === courseId &&
            ["InProgress", "Completed"].includes(en.status)
    );

    if (!enrollment) {
        throw new ApiError(403, "You don't have access to this course.");
    }

    const course = await Course.findById(courseId)
        .populate("instructor", "fullName");

    // Attach last watched time for each video
    const videosWithProgress = course.videos.map(video => {
        const history = enrollment.watch_history.find(
            h => h.material_id.toString() === video._id.toString()
        );
        return {
            ...video.toObject(),
            lastWatchedSeconds: history?.last_watched_time || 0,
            completed: history?.completed || false
        };
    });

    const certificateEntry = learner.certificates_earned.find((certificate) => {
        if (!certificate) return false;
        if (typeof certificate === "string") return certificate.includes(courseId);
        return certificate.course?.toString() === courseId;
    });

    res.json(new ApiResponse(200, {
        course: {
            _id: course._id,
            title: course.title,
            description: course.description,
            instructor: course.instructor,
            videos: videosWithProgress,
            resources: course.resources
        },
        yourProgress: enrollment.progress_percentage,
        status: enrollment.status,
        learnerName: learner.fullName,
        certificate: certificateEntry || null
    }));
});



// 3. Update video progress
export const updateVideoProgress = asyncHandler(async (req, res) => {
    const { courseId, videoId, currentTime, completed = false } = req.body;
    const learnerId = req.user._id;

    // Find learner
    const learner = await Learner.findById(learnerId);
    if (!learner) throw new ApiError(404, "Learner not found");

    // Verify enrollment
    const enrollment = learner.courses_enrolled.find(
        en => en.course.toString() === courseId &&
            ["InProgress", "Completed"].includes(en.status)
    );
    if (!enrollment) throw new ApiError(403, "You don't have access to this course");

    // Get course data
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "Course not found");

    // Find the specific video
    const video = course.videos.id(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // -----------------------------
    // UPDATE WATCH HISTORY
    // -----------------------------
    let watchEntry = enrollment.watch_history.find(
        h => h.material_id.toString() === videoId
    );

    // Video completion condition (95%)
    const isCompleted = completed || currentTime >= video.duration_seconds * 0.95;

    if (watchEntry) {
        watchEntry.last_watched_time = Math.min(currentTime, video.duration_seconds);
        watchEntry.completed = isCompleted;
        watchEntry.updatedAt = new Date();
    } else {
        enrollment.watch_history.push({
            material_id: videoId,
            last_watched_time: Math.min(currentTime, video.duration_seconds),
            completed: isCompleted,
            updatedAt: new Date()
        });
    }

    // -----------------------------
    // DYNAMIC PROGRESS CALCULATION
    // -----------------------------

    // 1. Sum duration of ALL course videos (dynamic)
    const totalDuration = course.videos.reduce(
        (sum, v) => sum + (v.duration_seconds || 0),
        0
    );

    // 2. Sum watched time ONLY for the videos that still exist in the course
    const watched = enrollment.watch_history.reduce((sum, h) => {
        const courseVideo = course.videos.find(
            v => v._id.toString() === h.material_id.toString()
        );

        if (!courseVideo) return sum; // Video removed from course → skip

        return sum + Math.min(h.last_watched_time, courseVideo.duration_seconds);
    }, 0);

    // 3. Calculate progress %
    const progress = totalDuration > 0
        ? Math.round((watched / totalDuration) * 100)
        : 0;

    enrollment.progress_percentage = progress;

    let message = "Progress updated";

    // -----------------------------
    // CHECK IF ALL CURRENT VIDEOS ARE COMPLETED
    // -----------------------------
    const allVideosCompleted = course.videos.every(v =>
        enrollment.watch_history.some(
            h => h.material_id.toString() === v._id.toString() && h.completed
        )
    );

    // -----------------------------
    // COURSE COMPLETION
    // -----------------------------
    if (allVideosCompleted && enrollment.status !== "Completed") {
        enrollment.status = "Completed";

        const existingCertificate = learner.certificates_earned.find((certificate) => {
            if (!certificate) return false;
            if (typeof certificate === "string") return certificate.includes(courseId);
            return certificate.course?.toString() === courseId;
        });

        if (!existingCertificate) {
            const certificateId = `${learnerId}-${courseId}`;
            learner.certificates_earned.push({
                certificateId,
                course: course._id,
                issuedAt: new Date()
            });
        }

        message = "Course completed! Certificate awarded.";
    }

    await learner.save();

    res.json(
        new ApiResponse(200, {
            message,
            progress: enrollment.progress_percentage,
            status: enrollment.status,
            certificates_earned: learner.certificates_earned
        })
    );
});


export const getBuyableCourses=asyncHandler(async(req,res)=>{
    const learnerId=req.user._id;

    const learner=await Learner.findById(learnerId);
    if(!learner)throw new ApiError(404,"Learner not found");

    const purchased=learner.courses_enrolled
        .filter(c=>c.status==="InProgress"||c.status==="Completed")
        .map(c=>c.course.toString());

    const courses=await Course.find({
        _id:{ $nin:purchased }
    })
    .populate("instructor","fullName userName bank_account_number")
    .select("title description price videos thumbnail createdAt");

    const eligibleCourses = courses.filter(
        (course) => course.instructor?.bank_account_number
    );

    const accountNumbers = eligibleCourses
        .map((course) => course.instructor?.bank_account_number)
        .filter(Boolean);
    const validAccounts = await BankAccount.find({
        account_number: { $in: accountNumbers },
    }).select("account_number");
    const validAccountSet = new Set(validAccounts.map((acc) => acc.account_number));
    const purchasableCourses = eligibleCourses.filter((course) =>
        validAccountSet.has(course.instructor?.bank_account_number)
    );

    const result=await Promise.all(
        purchasableCourses.map(async(course)=>{
            const enrolled=await Transaction.countDocuments({
                course_id:course._id,
                status:"COMPLETED"
            });

            return{
                _id:course._id,
                title:course.title,
                description:course.description,
                price:course.price,
                totalVideos:course.videos.length,
                enrolledStudents:enrolled,
                instructor:{
                    name:course.instructor?.fullName||"Unknown fullname",
                    username:course.instructor?.userName || "Unknown username"
                },
                thumbnail:course.thumbnail || course.videos[0]?.url||null
            };
        })
    );

    res.json(new ApiResponse(200,result));
});


export const searchCourses = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Search query is required"
        });
    }

    // Case-insensitive partial match
    const courses = await Course.find({
        title: { $regex: q, $options: "i" }
    }).populate("instructor", "fullName email");

    // Gracefully handle missing instructors
    const formatted = courses.map(course => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        lumpSumPayment: course.lumpSumPayment,
        instructor: course.instructor?.fullName || "Unknown Instructor",
        instructorEmail: course.instructor?.email || "Not Available",
        thumbnail: course.thumbnail || course.videos?.[0]?.url || null,
        createdAt: course.createdAt
    }));

    return res.json({
        success: true,
        count: formatted.length,
        courses: formatted
    });
});



export const getCoursesByInstructor = asyncHandler(async (req, res) => {
    const q = req.query.q?.trim();

    if (!q) {
        return res.json(new ApiResponse(200, [], "Query is required"));
    }

    const regex = new RegExp(q, "i"); // case-insensitive substring match

    // Find all courses where instructor's fullName or userName matches
    const courses = await Course.find()
        .populate("instructor", "fullName userName")
        .select("title description price videos thumbnail instructor");

    // Filter courses by instructor name or username
    const filtered = courses.filter(course => {
        if (!course.instructor) return false; // skip if no instructor
        return regex.test(course.instructor.fullName) || regex.test(course.instructor.userName);
    });

    // Format output
    const result = filtered.map(course => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        totalVideos: course.videos.length,
        thumbnail: course.thumbnail || course.videos[0]?.url || null,
        instructor: course.instructor
            ? { name: course.instructor.fullName, username: course.instructor.userName }
            : { name: "Unknown Instructor", username: null }
    }));

    res.json(new ApiResponse(200, result, `Found ${result.length} course(s)`));
});


