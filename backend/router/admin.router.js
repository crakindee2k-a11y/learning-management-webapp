// routes/admin.routes.js

import { Router } from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { deleteCourseByAdmin, getAllTransactions, getPlatformStats } from "../controller/admin.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyRole("Admin"));

router.get("/stats", getPlatformStats);
router.get("/transactions",getAllTransactions);
router.delete("/courses/:courseId", deleteCourseByAdmin);

export default router;