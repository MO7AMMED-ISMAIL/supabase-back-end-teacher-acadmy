import { Router } from "express";
import { StudentController } from "../../controllers/StudentController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { studentValidations } from "../../validations";

const router = Router();

// All routes require Teacher role as per structure_api.md
router.use(authMiddleware);

router.get("/", requireRole("teacher", "admin"), StudentController.getAll);
router.get("/:id", requireRole("teacher", "admin"), StudentController.getById);
router.post("/", requireRole("teacher", "admin"), studentValidations.create, validate, StudentController.create);
router.put("/:id", requireRole("teacher", "admin"), studentValidations.update, validate, StudentController.update);
router.delete("/:id", requireRole("teacher", "admin"), StudentController.delete);

export default router;
