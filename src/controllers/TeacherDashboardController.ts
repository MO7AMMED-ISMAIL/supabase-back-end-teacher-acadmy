import { Request, Response } from "express";
import { TeacherDashboardService } from "../services/TeacherDashboardService";
import { BaseController } from "./BaseController";

export class TeacherDashboardController extends BaseController {
    static getTeacherDashboard = async (req: Request, res: Response) => {
        try {
            const teacherId = (req as any).user.id;
            const data = await TeacherDashboardService.getDashboardData(teacherId);
            this.sendSuccess(res, data);
        } catch (error: any) {
            this.sendError(res, error.message);
        }
    };
}
