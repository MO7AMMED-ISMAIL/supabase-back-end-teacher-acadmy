import { Router } from "express";
import authRoutes from "./auth";
import teacherRoutes from "./teacher";
import subjectRoutes from "./subject";
import teacherSubjectRoutes from "./teacher-subject";
import enrollmentRoutes from "./enrollment";
import studentRoutes from "./student";
import scheduleRoutes from "./schedule";
import attendanceRoutes from "./attendance";

const router = Router();

router.use("/auth", authRoutes);
router.use("/teachers", teacherRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teacher-subjects", teacherSubjectRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/students", studentRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/attendance", attendanceRoutes);

export default router;