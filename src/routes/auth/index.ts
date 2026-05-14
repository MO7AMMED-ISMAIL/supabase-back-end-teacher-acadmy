import { Router } from "express";
import { AuthController } from "../../controllers/AuthController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { authValidations } from "../../validations";

const router = Router();

// Public routes
router.post("/dashboard/login", authValidations.login, validate, AuthController.dashboardLogin);
router.post("/mobile/login", authValidations.login, validate, AuthController.mobileLogin);
router.post("/create-admin", authValidations.createAdmin, validate, AuthController.createAdmin);

// Protected routes
router.post("/register", authMiddleware, requireRole("admin"), authValidations.register, validate, AuthController.register);
router.get("/me", authMiddleware, AuthController.me);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
