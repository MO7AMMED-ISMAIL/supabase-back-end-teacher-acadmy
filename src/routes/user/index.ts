import { Router } from "express";
import { UserController } from "../../controllers/UserController";
import { userValidator } from "../../validator/user.validator";
import { validate } from "../../middleware/validator.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/", authMiddleware, userController.getAll);
router.get("/:id", authMiddleware, userController.getById);
router.post("/", userValidator, validate, userController.create);
router.put("/:id", authMiddleware, userValidator, validate, userController.update);
router.delete("/:id", authMiddleware, userController.delete);

export default router;