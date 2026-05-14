import { Response } from "express";
import { ApiResponse } from "../types";

export abstract class BaseController {
    protected static sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
        const response: ApiResponse<T> = { success: true, data, message };
        res.status(statusCode).json(response);
    }

    protected static sendError(res: Response, error: string, statusCode = 500): void {
        const response: ApiResponse = { success: false, error };
        res.status(statusCode).json(response);
    }
}