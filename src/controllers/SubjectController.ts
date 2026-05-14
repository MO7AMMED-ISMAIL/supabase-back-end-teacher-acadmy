import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService";
import { BaseController } from "./BaseController";

const service = new SubjectService();

export class SubjectController extends BaseController {
    static async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAll();
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, error: "Subject not found" });
            return res.status(200).json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    static async create(req: Request, res: Response) {
        try {
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
            return res.status(200).json({ success: true, message: "Subject deleted" });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
