// routes/instructor.routes.js
import { Router } from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import {
    getApproveStudents,
    getCoursesEarningsForChart,
    getMyCourseDetails,
    getMyCoursesWithStats,
} from "../controller/instructor.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { addResourcesToCourse, addVideosToCourse, createCourse, deleteItem } from "../controller/course.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyRole("Instructor"));
router.post(
  "/create-course",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "files", maxCount: 50 },
    { name: "resourceFiles", maxCount: 50 },
  ]),
  createCourse
);
router.post("/:courseId/add-videos", upload.array("files", 20), addVideosToCourse);
router.post("/:courseId/add-resources", upload.array("files", 20), addResourcesToCourse);


router.delete("/:courseId/resource/:itemId", deleteItem);

router.get("/my-courses", getMyCoursesWithStats);
router.get("/approve-students/:courseId", getApproveStudents);
router.get("/total-earning-forChart",getCoursesEarningsForChart)

router.get("/course/:courseId/details", getMyCourseDetails);


export default router;
