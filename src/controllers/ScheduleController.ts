import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ScheduleService } from "../services/ScheduleService";

const scheduleService = new ScheduleService();

export class ScheduleController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedules = await scheduleService.getAll();
            this.sendSuccess(res, schedules);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch schedules");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.getById(req.params.id);
            if (!schedule) {
                this.sendError(res, "Schedule not found", 404);
                return;
            }
            this.sendSuccess(res, schedule);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.create(req.body);
            this.sendSuccess(res, schedule, 201, "Schedule created");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.update(req.params.id, req.body);
            this.sendSuccess(res, schedule, 200, "Schedule updated");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await scheduleService.delete(req.params.id);
            this.sendSuccess(res, null, 200, "Schedule deleted");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
