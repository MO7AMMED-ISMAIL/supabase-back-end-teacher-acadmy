import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[Error] ${req.method} ${req.url}`, err);

    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    const response: ApiResponse = {
        success: false,
        error: message,
    };

    res.status(statusCode).json(response);
};
