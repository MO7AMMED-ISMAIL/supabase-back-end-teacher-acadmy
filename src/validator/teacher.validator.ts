import { body, param } from "express-validator";

export const teacherValidator = {
    create: [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("full_name").notEmpty().withMessage("Full name is required"),
        body("subject_specialization").optional().isString(),
        body("phone").optional({nullable: true}).isString(),
    ],
    update: [
        param("id").isUUID().withMessage("Invalid teacher ID"),
        body("full_name").optional().isString(),
        body("subject_specialization").optional().isString(),
        body("phone").optional({nullable: true}).isString(),
        body("is_active").optional().isBoolean(),
    ],
    delete: [
        param("id").isUUID().withMessage("Invalid teacher ID"),
    ]
};
