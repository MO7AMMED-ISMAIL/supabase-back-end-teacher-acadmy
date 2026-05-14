import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { TeacherSubjectService } from "../services/TeacherSubjectService";

const teacherSubjectService = new TeacherSubjectService();

export class TeacherSubjectController extends BaseController {
    registerRoutes(): void { }

    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignments = await teacherSubjectService.getAll();
            res.status(200).json({ success: true, data: assignments });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Failed to fetch assignments" });
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.getById(req.params.id);
            if (!assignment) {
                res.status(404).json({ success: false, error: "Assignment not found" });
                return;
            }
            res.status(200).json({ success: true, data: assignment });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.create(req.body);
            res.status(201).json({ success: true, data: assignment, message: "Assignment created" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: assignment, message: "Assignment updated" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await teacherSubjectService.delete(req.params.id);
            res.status(200).json({ success: true, data: null, message: "Assignment deleted" });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };
}
