import express from "express";
import {
  getAllCourses,
  getCoursePublicDetails,
  getCoursesByCategory,
  getMostViewedCourses,
} from "../controller/course.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const router = express.Router();


router.get("/get-courses", getAllCourses);

router.get("/by-category", getCoursesByCategory);
router.get("/most-enrolled", getMostViewedCourses);

router.get("/:courseId", getCoursePublicDetails);


export default router;