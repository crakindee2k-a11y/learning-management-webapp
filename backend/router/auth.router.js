import express from "express";
import { signupUser, loginUser, logoutUser, getCurrentUser } from "../controller/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Signup (Learner & Instructor only)
router.post("/signup", signupUser);

// Login (all roles)
router.post("/login", loginUser);

// Logout (all roles)
router.post("/logout", verifyJWT, logoutUser);

// Get current user (cookie-based auth)
router.get("/me", verifyJWT, getCurrentUser);

export default router;
