import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { EnrollmentService } from "../services/EnrollmentService";

const enrollmentService = new EnrollmentService();

export class EnrollmentController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollments = await enrollmentService.getAll();
            this.sendSuccess(res, enrollments);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch enrollments");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollment = await enrollmentService.create(req.body);
            this.sendSuccess(res, enrollment, 201, "Enrollment created");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await enrollmentService.delete(req.params.id);
            this.sendSuccess(res, null, 200, "Enrollment deleted");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
