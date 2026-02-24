// bank.controller.js

import { BankAccount } from "../model/bankAccount.model.js";
import { User } from "../model/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import asyncHandler from "express-async-handler";

/**
 * @desc   Create a new bank account and link it to a user
 * @route  POST /api/bank/create-account
 * @access Private (Any logged-in user)
 * 
 * DEMONSTRATION FLOW:
 * 1. Generate unique account number (timestamp-based)
 * 2. Generate random secret key (used for payment authentication)
 * 3. Create BankAccount document with initial balance
 * 4. Link account to User (stores account_number + secret)
 */
export const createBankAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id; // User ID from JWT middleware (verifyJWT)
  const initialBalance = 5000; // DEFAULT: $5000 starting balance for demo purposes

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // VALIDATION: One bank account per user
  // (Users can link existing accounts, but can't create multiple)
  if (user.bank_account_number || user.bank_secret) {
    throw new ApiError(400, "User already has a bank account linked");
  }

  // GENERATE: Unique account number (AC + timestamp + random)
  const bank_account_number = "AC" + Date.now() + Math.floor(Math.random() * 1000);
  // GENERATE: 12-character secret key for payment authentication
  const bank_secret = crypto.randomBytes(6).toString("hex");

  const newBankAccount = await BankAccount.create({
    account_number: bank_account_number,
    current_balance: initialBalance,
    secret_key: bank_secret
  });

  // LINK: Store account number + secret in User document for quick lookup
  user.bank_account_number = bank_account_number;
  user.bank_secret = bank_secret;
  await user.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        bank_account_number,
        bank_secret,
        current_balance: newBankAccount.current_balance,
      },
      "Congrats! Account Create successfully.For adding balance contact with Bank."
    )
  );
});


// ==============================
//         PAYMENT SYSTEM
// ==============================
 
/**
 * @desc   Payment processing between learner → instructor → admin
 * @access Internal (called inside API)
 * 
 * PAYMENT SPLIT (for course enrollment):
 * - 80% goes to Instructor (course creator)
 * - 20% goes to Admin (platform commission)
 * 
 * SECURITY: Requires learner's bank secret key to authorize payment
 */
export const executeImmediatePayment = async ({
  learnerId,
  learnerBankAccount,
  secretKey,
  instructorBankAccount,
  amount
}) => {

  // ADMIN ACCOUNT: Loaded from environment variable (set in .env)
  // This account receives platform commission (20% of all course sales)
  const adminAccountNumber = process.env.ADMIN_BANK_ACCOUNT_NUMBER;
  if (!adminAccountNumber) {
    throw new ApiError(500, "ADMIN_BANK_ACCOUNT_NUMBER is missing");
  }

  const learner = await User.findById(learnerId);
  if (!learner) throw new ApiError(404, "Learner not found");

  // SECURITY: Verify learner's bank credentials match
  // This ensures only the account owner can authorize payments
  if (
    learner.bank_account_number !== learnerBankAccount ||
    learner.bank_secret !== secretKey
  ) {
    throw new ApiError(400, "Invalid bank credentials");
  }

  const [learnerAcc, instructorAcc, adminAcc] = await Promise.all([
    BankAccount.findOne({ account_number: learnerBankAccount }),
    BankAccount.findOne({ account_number: instructorBankAccount }),
    BankAccount.findOne({ account_number: adminAccountNumber }),
  ]);

  if (!learnerAcc) throw new ApiError(404, "Learner bank account not found");
  if (!instructorAcc) throw new ApiError(404, "Instructor bank account not found");
  if (!adminAcc) throw new ApiError(404, "Admin bank account not found");

  // VALIDATION: Ensure learner has enough funds
  if (learnerAcc.current_balance < amount) {
    throw new ApiError(400, "Insufficient balance");
  }

  // PAYMENT SPLIT: 20% platform fee, 80% to instructor
  const adminShare = amount * 0.2;      // Platform commission
  const instructorShare = amount * 0.8;  // Instructor earnings

  // EXECUTE PAYMENT: Deduct from learner, credit to instructor & admin
  learnerAcc.current_balance -= amount;
  instructorAcc.current_balance += instructorShare;
  adminAcc.current_balance += adminShare;

  await Promise.all([
    learnerAcc.save({ validateBeforeSave: false }),
    instructorAcc.save({ validateBeforeSave: false }),
    adminAcc.save({ validateBeforeSave: false }),
  ]);

  // UPDATE INSTRUCTOR STATS: Track total earnings for analytics
  const instructor = await User.findOne({ bank_account_number: instructorBankAccount });
  if (instructor?.role === "Instructor") {
    instructor.total_earnings += instructorShare;
    await instructor.save();
  }
};



// GET USER CURRENT BALANCE
export const getUserCurrentBalance = asyncHandler(async (req, res) => {
    const userId = req.user._id; // From auth middleware

    // 1️⃣ Get user
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    if (!user.bank_account_number || !user.bank_secret) {
        return res.status(400).json(new ApiResponse(400, null, "Bank account not linked or secret missing"));
    }

    // 2️⃣ Find bank account
    const bank = await BankAccount.findOne({ account_number: user.bank_account_number });
    if (!bank) {
        return res.status(404).json(new ApiResponse(404, null, "Bank account not found"));
    }

    // 3️⃣ Verify bank secret
    if (bank.secret_key !== user.bank_secret) {
        return res.status(403).json(new ApiResponse(403, null, "Invalid bank credentials"));
    }

    // 4️⃣ Return current balance
    return res.status(200).json(new ApiResponse(200, {
        account_number: bank.account_number,
        current_balance: bank.current_balance,
        bank_secret: user.bank_secret
    }, "Current balance fetched successfully"));
});


