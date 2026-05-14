import { Router } from "express";
import { TeacherController } from "../../controllers/TeacherController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { teacherValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", TeacherController.getAll);
router.get("/:id", TeacherController.getById);
router.post("/", TeacherController.create);
router.put("/:id", teacherValidations.update, validate, TeacherController.update);
router.delete("/:id", TeacherController.delete);

export default router;
