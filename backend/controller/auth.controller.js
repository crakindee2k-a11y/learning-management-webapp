// auth.controller.js
import { User } from "../model/user.model.js";
import { Learner } from "../model/learner.model.js";
import { Instructor } from "../model/instructor.model.js";
import { Admin } from "../model/Admin.model.js";
import { BankAccount } from "../model/bankAccount.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// =========================
// Generate Tokens
// =========================
// PURPOSE: Creates JWT access & refresh tokens for authenticated users
// USED BY: Login and signup flows
const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(500, "User not found for token generation");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// =========================
// SIGNUP (only for Learner & Instructor)
// =========================
// FLOW: User Registration → Creates new Learner or Instructor account
// NOTE: Admin cannot signup via this endpoint (created via seeding only)
export const signupUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password, role, bank_account_number, bank_secret } = req.body;

  if (!role) throw new ApiError(400, "Role is required in request body");

  // Admin cannot signup
  if (role.toLowerCase() === "admin") throw new ApiError(403, "Admin cannot signup via API");

  // IMPORTANT: Use discriminator pattern - Learner/Instructor extend base User model
  // This allows role-specific fields while sharing common User fields
  let RoleModel;
  switch (role.toLowerCase()) {
    case "learner":
      RoleModel = Learner;
      break;
    case "instructor":
      RoleModel = Instructor;
      break;
    default:
      throw new ApiError(400, "Invalid role provided");
  }

  // VALIDATION: Ensure unique email and username across all users
  if (await User.findOne({ email })) throw new ApiError(400, "Email already exists");
  if (await User.findOne({ userName })) throw new ApiError(400, "Username already exists");

  // OPTIONAL: Link existing bank account during signup
  // Users can also create/link bank accounts later via /api/bank endpoints
  let validatedBankAccount = null;
  if (bank_account_number) {
    const bank = await BankAccount.findOne({ account_number: bank_account_number });
    if (!bank) throw new ApiError(400, "Bank account does not exist");
    if (bank.secret_key !== bank_secret) throw new ApiError(400, "Invalid bank secret key");
    validatedBankAccount = bank;
  }

  // Create user
  const user = await RoleModel.create({
    fullName,
    userName,
    email,
    password,
    role: role.charAt(0).toUpperCase() + role.slice(1),
    bank_account_number: validatedBankAccount ? bank_account_number : null,
    bank_secret: validatedBankAccount ? bank_secret : null,
  });

  return res.status(201).json(new ApiResponse(
    201,
    { id: user._id, role: user.role, email: user.email, userName: user.userName },
    `${user.role} created successfully`
  ));
});

// =========================
// LOGIN (all roles including Admin)
// =========================
// FLOW: Email + Password + Role → JWT tokens in cookies → User data returned
// CRITICAL: Must match BOTH email AND role (same email can exist for different roles)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!role) throw new ApiError(400, "Role is required in request body");

  // IMPORTANT: Role must be capitalized ("Learner", "Instructor", "Admin")
  let roleFormatted = role.charAt(0).toUpperCase() + role.slice(1);
  // Query requires BOTH email and role match - prevents cross-role login
  const user = await User.findOne({ email, role: roleFormatted });
  if (!user) throw new ApiError(400, "User not found");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(400, "Invalid password");

  // Generate JWT tokens and save refresh token to database
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // SECURITY: Never return sensitive fields (password, secrets) to frontend
  const sanitizedUser = await User.findById(user._id).select("-password -refreshToken -bank_secret -bank_account_number");
  // SECURITY: HTTP-only cookies prevent XSS attacks, secure flag for HTTPS only
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: sanitizedUser }, `${user.role} logged in successfully`));
});

// =========================
// LOGOUT (all roles including Admin)
// =========================
// FLOW: Clear refresh token from DB + Clear cookies → User logged out
export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" };

  if (userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken -bank_secret -bank_account_number"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, { user }, "Current user fetched successfully"));
});
