import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { EnrollmentService } from "../services/EnrollmentService";

const enrollmentService = new EnrollmentService();

export class EnrollmentController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollments = await enrollmentService.getAll();
            EnrollmentController.sendSuccess(res, enrollments);
        } catch (err) {
            EnrollmentController.sendError(res, err instanceof Error ? err.message : "Failed to fetch enrollments");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollment = await enrollmentService.create(req.body);
            EnrollmentController.sendSuccess(res, enrollment, 201, "Enrollment created");
        } catch (err) {
            EnrollmentController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await enrollmentService.delete(req.params.id);
            EnrollmentController.sendSuccess(res, null, 200, "Enrollment deleted");
        } catch (err) {
            EnrollmentController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
