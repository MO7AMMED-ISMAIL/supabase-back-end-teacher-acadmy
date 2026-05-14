import { Router } from "express";
import { UserController } from "../../controllers/UserController";
import { userValidator } from "../../validator/user.validator";
import { validate } from "../../middleware/validator.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, UserController.getAll);
router.get("/:id", authMiddleware, UserController.getById);
router.post("/", userValidator, validate, UserController.create);
router.put("/:id", authMiddleware, userValidator, validate, UserController.update);
router.delete("/:id", authMiddleware, UserController.delete);

export default router;