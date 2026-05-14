import { Router } from "express";
import { SubjectController } from "../../controllers/SubjectController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { subjectValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin", "teacher"), SubjectController.getAll);
router.get("/:id", requireRole("admin", "teacher"), SubjectController.getById);
router.post("/", requireRole("admin"), subjectValidations.create, validate, SubjectController.create);
router.put("/:id", requireRole("admin"), subjectValidations.update, validate, SubjectController.update);
router.delete("/:id", requireRole("admin"), SubjectController.delete);

export default router;
