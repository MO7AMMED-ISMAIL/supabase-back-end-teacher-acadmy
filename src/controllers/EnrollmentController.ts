import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { EnrollmentService } from "../services/EnrollmentService";

const enrollmentService = new EnrollmentService();

export class EnrollmentController extends BaseController {
    registerRoutes(): void { }

    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollments = await enrollmentService.getAll();
            res.status(200).json({ success: true, data: enrollments });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Failed to fetch enrollments" });
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const enrollment = await enrollmentService.create(req.body);
            res.status(201).json({ success: true, data: enrollment, message: "Enrollment created" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await enrollmentService.delete(req.params.id);
            res.status(200).json({ success: true, data: null, message: "Enrollment deleted" });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };
}
