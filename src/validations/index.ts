import { body, param } from "express-validator";

export const authValidations = {
    login: [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    register: [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("name").notEmpty().withMessage("Name is required"),
        body("role").isIn(["admin", "teacher", "student"]).withMessage("Invalid role"),
    ],
    createAdmin: [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("name").notEmpty().withMessage("Name is required"),
    ]
};

export const subjectValidations = {
    create: [
        body("name").notEmpty().withMessage("Subject name is required"),
        body("description").optional().isString(),
    ],
    update: [
        param("id").isUUID().withMessage("Invalid subject ID"),
        body("name").optional().notEmpty().withMessage("Subject name cannot be empty"),
        body("description").optional().isString(),
        body("is_active").optional().isBoolean().withMessage("is_active must be a boolean"),
    ]
};

export const studentValidations = {
    create: [
        body("full_name").notEmpty().withMessage("Full name is required"),
        body("address").optional().isString(),
        body("phone").optional().isString(),
        body("parent_phone").optional().isString(),
        body("notes").optional().isString(),
    ],
    update: [
        param("id").isUUID().withMessage("Invalid student ID"),
        body("full_name").optional().notEmpty(),
        body("is_active").optional().isBoolean(),
    ]
};

export const teacherSubjectValidations = {
    create: [
        body("teacher_id").isUUID().withMessage("Invalid teacher ID"),
        body("subject_id").isUUID().withMessage("Invalid subject ID"),
    ]
};

export const enrollmentValidations = {
    create: [
        body("student_id").isUUID().withMessage("Invalid student ID"),
        body("teacher_subject_id").isUUID().withMessage("Invalid teacher_subject ID"),
    ]
};

export const scheduleValidations = {
    create: [
        body("teacher_subject_id").isUUID().withMessage("Invalid teacher_subject ID"),
        body("day_of_week").isInt({ min: 0, max: 6 }).withMessage("Day of week must be between 0 and 6"),
        body("start_time").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Start time must be HH:mm"),
        body("end_time").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("End time must be HH:mm"),
    ]
};

export const attendanceValidations = {
    submit: [
        body("subject").not().exists().withMessage("subject field is not accepted — use teacherSubject instead (BREAKING CHANGE)"),
        body("teacherSubject").isUUID().withMessage("Invalid teacherSubject ID"),
        body("date").isISO8601().withMessage("Date must be a valid ISO date").toDate(),
        body("records").isArray({ min: 1 }).withMessage("At least one student record is required"),
        body("records.*.student").isUUID().withMessage("Invalid student ID"),
        body("records.*.status").isIn(["present", "absent", "late"]).withMessage("Status must be present, absent, or late"),
        body("records").custom((records) => {
            const ids = records.map((r: any) => r.student);
            const unique = new Set(ids);
            if (unique.size !== ids.length) {
                throw new Error("Duplicate students in records");
            }
            return true;
        }),
    ]
};
