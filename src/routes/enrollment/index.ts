import { Router } from "express";
import { EnrollmentController } from "../../controllers/EnrollmentController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { enrollmentValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin", "teacher"), EnrollmentController.getAll);
router.post("/", requireRole("admin", "teacher"), enrollmentValidations.create, validate, EnrollmentController.create);
router.delete("/:id", requireRole("admin", "teacher"), EnrollmentController.delete);

export default router;
