import { Router } from "express";
import { AdminDashboardController } from "../../controllers/AdminDashboardController";
import { TeacherDashboardController } from "../../controllers/TeacherDashboardController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.get("/admin", authMiddleware, requireRole("admin"), AdminDashboardController.getAdminDashboard);
router.get("/teacher", authMiddleware, requireRole("teacher"), TeacherDashboardController.getTeacherDashboard);

export default router;
