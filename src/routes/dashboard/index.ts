import { Router } from "express";
import { TeacherDashboardController } from "../../controllers/TeacherDashboardController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.get("/teacher", authMiddleware, requireRole("teacher"), TeacherDashboardController.getTeacherDashboard);

export default router;
