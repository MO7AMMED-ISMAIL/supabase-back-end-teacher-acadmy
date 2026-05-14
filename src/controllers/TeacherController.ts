import { Request, Response } from "express";
import { TeacherService } from "../services/TeacherService";
import { BaseController } from "./BaseController";

const service = new TeacherService();

export class TeacherController extends BaseController {
    static async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAllTeachers();
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, error: "Teacher not found" });
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            // Creation of teacher profile is handled in AuthService.register
            // Here we might handle adding specific teacher details if any.
            const data = await service.create(req.body);
            return res.status(201).json({ success: true, data });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const data = await service.update(req.params.id, req.body);
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Teacher deleted" });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
