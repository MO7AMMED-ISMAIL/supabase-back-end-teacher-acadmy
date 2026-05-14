import { Request, Response, NextFunction } from "express";
import { db } from "../config/database";
import { ApiResponse } from "../types";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const response: ApiResponse = {
            success: false,
            error: "Unauthorized: No token provided",
        };
        return res.status(401).json(response);
    }

    const token = authHeader.split(" ")[1];

    try {
        const { data: { user }, error } = await db.auth.getUser(token);
        
        if (error || !user) {
            const response: ApiResponse = {
                success: false,
                error: "Unauthorized: Invalid or expired token",
            };
            return res.status(401).json(response);
        }

        (req as any).user = user;
        next();
    } catch (err) {
        const response: ApiResponse = {
            success: false,
            error: "Unauthorized: Token verification failed",
        };
        return res.status(401).json(response);
    }
};
