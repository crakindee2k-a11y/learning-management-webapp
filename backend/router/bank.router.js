import express from "express";
import { createBankAccount,getUserCurrentBalance } from "../controller/bank.controller.js";
import {verifyJWT } from "../middlewares/auth.middleware.js"; // JWT auth middleware

const router = express.Router();

/**
 * @route   POST /api/bank/create-account
 * @desc    Create a new bank account and link it to logged-in user
 * @access  Private
 */
router.post("/create-account", verifyJWT, createBankAccount);
router.get("/current-balance",verifyJWT,getUserCurrentBalance);

export default router;