// controllers/admin.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Course } from "../model/course.model.js";
import { User } from "../model/user.model.js";
import { Transaction } from "../model/transaction.model.js";
import { BankAccount } from "../model/bankAccount.model.js";
import { Instructor } from "../model/instructor.model.js";
import { Learner } from "../model/learner.model.js";

const getPlatformStats = asyncHandler(async (req, res) => {
  // verifyRole("Admin") already applied in route
  // No need to check again — but keep for safety
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  const adminAccountNumber = process.env.ADMIN_BANK_ACCOUNT_NUMBER;
  if (!adminAccountNumber) {
    throw new ApiError(500, "ADMIN_BANK_ACCOUNT_NUMBER is missing");
  }

  // === 1. Basic Stats ===
  const [
    totalCourses,
    totalLearners,
    totalInstructors,
    totalEnrollments,
    adminBank
  ] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: "Learner" }),
    User.countDocuments({ role: "Instructor" }),
    Transaction.countDocuments({ type: "PURCHASE", status: "COMPLETED" }),
    BankAccount.findOne({ account_number: adminAccountNumber })
  ]);

  const adminIncome = adminBank?.current_balance || 0;
  const totalRevenue = adminIncome * 5; // 20% admin → 100% = 5x

  // === 2. Monthly Revenue Chart (Last 12 Months) ===
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const monthlyRevenue = await Transaction.aggregate([
    {
      $match: {
        type: "PURCHASE",
        status: "COMPLETED",
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $project: {
        month: {
          $dateToString: {
            format: "%b %Y",
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: 1
              }
            }
          }
        },
        revenue: { $multiply: ["$totalAmount", 0.2] }, // Admin 20%
        enrollments: "$count"
      }
    }
  ]);

  // Fill missing months with 0
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const current = new Date();
  const chartData = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(current.getMonth() - i);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    const found = monthlyRevenue.find(item => item.month === monthKey);
    chartData.push({
      month: monthKey,
      revenue: found ? Math.round(found.revenue) : 0,
      enrollments: found ? found.enrollments : 0
    });
  }

  // === Final Response ===
  const stats = {
    overview: {
      totalCourses,
      totalLearners,
      totalInstructors,
      totalEnrollments,
      totalRevenue,
      adminIncome,
      platformCommission: "20%"
    },
    monthlyRevenueChart: chartData,
    lastUpdated: new Date().toISOString()
  };

  return res.status(200).json(
    new ApiResponse(200, stats, "Admin dashboard stats fetched successfully")
  );
});

export { getPlatformStats };


// Admin API: Get all transactions with user & account details
export const getAllTransactions = asyncHandler(async (req, res) => {
    // Optional: pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate("from_user", "fullName userName email")
        .populate("to_user", "fullName userName email")
        .populate("course_id", "title");

    const formatted = transactions.map(txn => ({
        transaction_id: txn.transaction_id,
        type: txn.type,
        amount: txn.amount,
        status: txn.status,
        timestamp: txn.timestamp,
        from_user: txn.from_user
            ? { id: txn.from_user._id, name: txn.from_user.fullName, username: txn.from_user.userName, email: txn.from_user.email }
            : null,
        from_account_number: txn.from_account_number,
        to_user: txn.to_user
            ? { id: txn.to_user._id, name: txn.to_user.fullName, username: txn.to_user.userName, email: txn.to_user.email }
            : null,
        to_account_number: txn.to_account_number,
        course: txn.course_id
            ? { id: txn.course_id._id, title: txn.course_id.title }
            : null
    }));

    res.json(new ApiResponse(200, formatted, `Page ${page} transactions fetched`));
});

export const deleteCourseByAdmin = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  await Promise.all([
    Instructor.findByIdAndUpdate(course.instructor, {
      $pull: { courses_taught: course._id },
    }),
    Learner.updateMany(
      { "courses_enrolled.course": course._id },
      { $pull: { courses_enrolled: { course: course._id } } },
    ),
    Transaction.updateMany({ course_id: course._id }, { $set: { course_id: null } }),
  ]);

  await Course.findByIdAndDelete(course._id);

  return res
    .status(200)
    .json(new ApiResponse(200, { courseId }, "Course deleted successfully"));
});
