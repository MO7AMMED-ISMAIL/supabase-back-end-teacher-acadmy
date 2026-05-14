import { Router } from "express";
import { ScheduleController } from "../../controllers/ScheduleController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { scheduleValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("teacher", "admin"), ScheduleController.getAll);
router.get("/:id", requireRole("teacher", "admin"), ScheduleController.getById);
router.post("/", requireRole("teacher", "admin"), scheduleValidations.create, validate, ScheduleController.create);
router.put("/:id", requireRole("teacher", "admin"), ScheduleController.update);
router.delete("/:id", requireRole("teacher", "admin"), ScheduleController.delete);

export default router;
