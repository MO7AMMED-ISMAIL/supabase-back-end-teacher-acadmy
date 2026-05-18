import { Request, Response } from "express";
import { AdminDashboardService } from "../services/AdminDashboardService";
import { BaseController } from "./BaseController";

export class AdminDashboardController extends BaseController {
    static getAdminDashboard = async (req: Request, res: Response) => {
        try {
            const data = await AdminDashboardService.getDashboardData();
            this.sendSuccess(res, data);
        } catch (error: any) {
            this.sendError(res, error.message);
        }
    }
}
