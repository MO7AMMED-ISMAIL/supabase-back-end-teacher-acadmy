import { Request, Response } from "express";
import { ApiResponse } from "../types";

export abstract class BaseController {
    protected sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
        const response: ApiResponse<T> = { success: true, data, message };
        res.status(statusCode).json(response);
    }

    protected sendError(res: Response, error: string, statusCode = 500): void {
        const response: ApiResponse = { success: false, error };
        res.status(statusCode).json(response);
    }

    // Each controller must define its routes
    abstract registerRoutes(): void;
}