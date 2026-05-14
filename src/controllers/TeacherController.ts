import { Request, Response } from "express";
import { TeacherService } from "../services/TeacherService";
import { BaseController } from "./BaseController";

const service = new TeacherService();

export class TeacherController extends BaseController {
    static async getAll(req: Request, res: Response) {
        try {
            const data = await service.getAllTeachers();
            this.sendSuccess(res, data);
        } catch (error: any) {
            this.sendError(res, error.message);
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return this.sendError(res, "Teacher not found", 404);
            this.sendSuccess(res, data);
        } catch (error: any) {
            this.sendError(res, error.message);
        }
    }

    static async create(req: Request, res: Response) {
        try {
            // Creation of teacher profile is handled in AuthService.register
            // Here we might handle adding specific teacher details if any.
            const data = await service.create(req.body);
            this.sendSuccess(res, data, 201);
        } catch (error: any) {
            this.sendError(res, error.message, 400);
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const data = await service.update(req.params.id, req.body);
            this.sendSuccess(res, data);
        } catch (error: any) {
            this.sendError(res, error.message, 400);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id);
            this.sendSuccess(res, null, 200, "Teacher deleted");
        } catch (error: any) {
            this.sendError(res, error.message);
        }
    }
}
