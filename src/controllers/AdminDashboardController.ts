import { Request, Response } from "express";
import { AdminDashboardService } from "../services/AdminDashboardService";
import { BaseController } from "./BaseController";

export class AdminDashboardController extends BaseController {
    static async getAdminDashboard(req: Request, res: Response) {
        try {
            const data = await AdminDashboardService.getDashboardData();
            return res.json({
                success: true,
                data
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
