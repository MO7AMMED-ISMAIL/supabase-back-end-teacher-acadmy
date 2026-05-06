import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types";

export const authMiddleware = (
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        (req as any).user = decoded;
        next();
    } catch (err) {
        const response: ApiResponse = {
            success: false,
            error: "Unauthorized: Invalid token",
        };
        return res.status(401).json(response);
    }
};
