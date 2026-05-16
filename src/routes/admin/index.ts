import { Router } from "express";
import { AdminDashboardController } from "../../controllers/AdminDashboardController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, requireRole("admin"), AdminDashboardController.getAdminDashboard);

export default router;
