import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { ScheduleService } from "../services/ScheduleService";

const scheduleService = new ScheduleService();

export class ScheduleController extends BaseController {
    registerRoutes(): void { }

    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedules = await scheduleService.getAll();
            res.status(200).json({ success: true, data: schedules });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Failed to fetch schedules" });
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.getById(req.params.id);
            if (!schedule) {
                res.status(404).json({ success: false, error: "Schedule not found" });
                return;
            }
            res.status(200).json({ success: true, data: schedule });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.create(req.body);
            res.status(201).json({ success: true, data: schedule, message: "Schedule created" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const schedule = await scheduleService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: schedule, message: "Schedule updated" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await scheduleService.delete(req.params.id);
            res.status(200).json({ success: true, data: null, message: "Schedule deleted" });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };
}
