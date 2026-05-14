import { Router } from "express";
import { TeacherSubjectController } from "../../controllers/TeacherSubjectController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { teacherSubjectValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin", "teacher"), TeacherSubjectController.getAll);
router.get("/:id", requireRole("admin", "teacher"), TeacherSubjectController.getById);
router.post("/", requireRole("admin"), teacherSubjectValidations.create, validate, TeacherSubjectController.create);
router.put("/:id", requireRole("admin"), TeacherSubjectController.update);
router.delete("/:id", requireRole("admin"), TeacherSubjectController.delete);

export default router;
