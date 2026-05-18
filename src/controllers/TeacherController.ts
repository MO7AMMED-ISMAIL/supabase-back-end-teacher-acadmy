import { Request, Response } from "express";
import { TeacherService } from "../services/TeacherService";
import { BaseController } from "./BaseController";

const service = new TeacherService();

export class TeacherController extends BaseController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const data = await service.getAllTeachers();
            TeacherController.sendSuccess(res, data);
        } catch (error: any) {
            TeacherController.sendError(res, error.message);
        }
    }

    static getById = async (req: Request, res: Response) => {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return TeacherController.sendError(res, "Teacher not found", 404);
            TeacherController.sendSuccess(res, data);
        } catch (error: any) {
            TeacherController.sendError(res, error.message);
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const data = await service.create(req.body);
            TeacherController.sendSuccess(res, data, 201);
        } catch (error: any) {
            TeacherController.sendError(res, error.message, 400);
        }
    }

    static update = async (req: Request, res: Response) => {
        try {
            const data = await service.update(req.params.id, req.body);
            TeacherController.sendSuccess(res, data);
        } catch (error: any) {
            TeacherController.sendError(res, error.message, 400);
        }
    }

    static delete = async (req: Request, res: Response) => {
        try {
            await service.delete(req.params.id);
            TeacherController.sendSuccess(res, null, 200, "Teacher deleted");
        } catch (error: any) {
            TeacherController.sendError(res, error.message);
        }
    }
}
