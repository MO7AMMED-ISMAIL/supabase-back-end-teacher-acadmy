import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { TeacherDashboardService } from "../services/TeacherDashboardService";

export class TeacherDashboardController extends BaseController {
    static getTeacherDashboard = async (req: Request, res: Response): Promise<void> => {
        try {
            // Assuming the teacher ID is available in the request (e.g., from authMiddleware)
            const teacherId = (req as any).user?.id;
            if (!teacherId) {
                this.sendError(res, "Teacher not authenticated", 401);
                return;
            }

            const data = await TeacherDashboardService.getTeacherDashboardData(teacherId);
            TeacherDashboardController.sendSuccess(res, data);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch teacher dashboard data");
        }
    };
}
