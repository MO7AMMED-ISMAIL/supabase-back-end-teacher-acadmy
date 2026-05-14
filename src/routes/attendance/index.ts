import { Router } from "express";
import { AttendanceController } from "../../controllers/AttendanceController";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validator.middleware";
import { attendanceValidations } from "../../validations";

const router = Router();

router.use(authMiddleware);

router.get("/summary", requireRole("teacher", "admin"), AttendanceController.getSummary);
router.get("/", requireRole("teacher", "admin"), AttendanceController.getAll);
router.get("/:id", requireRole("teacher", "admin"), AttendanceController.getById);
router.post("/", requireRole("teacher", "admin"), attendanceValidations.submit, validate, AttendanceController.submitAttendance);

export default router;
