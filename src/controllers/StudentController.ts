import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { StudentService } from "../services/StudentService";

const studentService = new StudentService();

export class StudentController extends BaseController {
    registerRoutes(): void { }

    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const students = await studentService.getAll();
            const response = { success: true, data: students };
            res.status(200).json(response);
        } catch (err) {
            const response = { success: false, error: err instanceof Error ? err.message : "Failed to fetch students" };
            res.status(500).json(response);
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.getById(req.params.id);
            if (!student) {
                res.status(404).json({ success: false, error: "Student not found" });
                return;
            }
            res.status(200).json({ success: true, data: student });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.create(req.body);
            res.status(201).json({ success: true, data: student, message: "Student created" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: student, message: "Student updated" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await studentService.delete(req.params.id);
            res.status(200).json({ success: true, data: null, message: "Student deleted" });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };
}
