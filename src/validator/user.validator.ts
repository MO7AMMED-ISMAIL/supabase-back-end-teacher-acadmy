import { body } from "express-validator";

export const userValidator = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("full_name").optional().isString().withMessage("Full name must be a string"),
];
