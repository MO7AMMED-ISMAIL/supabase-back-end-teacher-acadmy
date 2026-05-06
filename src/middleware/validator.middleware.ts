import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../types";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response: ApiResponse = {
            success: false,
            error: "Validation Error",
            data: errors.array(),
        };
        return res.status(400).json(response);
    }
    next();
};
