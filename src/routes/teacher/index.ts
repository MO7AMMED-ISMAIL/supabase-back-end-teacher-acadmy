import { Router } from "express";
import { TeacherController } from "../../controllers/TeacherController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { teacherValidator } from "../../validator/teacher.validator";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", TeacherController.getAll);
router.get("/:id", TeacherController.getById);
router.post("/", teacherValidator.create, validate, TeacherController.create);
router.put("/:id", teacherValidator.update, validate, TeacherController.update);
router.delete("/:id", teacherValidator.delete, validate, TeacherController.delete);

export default router;
