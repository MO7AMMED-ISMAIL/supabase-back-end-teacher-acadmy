import { Request, Response } from "express";
import { SubjectService } from "../services/SubjectService";
import { BaseController } from "./BaseController";

const service = new SubjectService();

export class SubjectController extends BaseController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const data = await service.getAll();
            SubjectController.sendSuccess(res, data);
        } catch (error: any) {
            SubjectController.sendError(res, error.message);
        }
    }

    static getById = async (req: Request, res: Response) => {
        try {
            const data = await service.getById(req.params.id);
            if (!data) return SubjectController.sendError(res, "Subject not found", 404);
            SubjectController.sendSuccess(res, data);
        } catch (error: any) {
            SubjectController.sendError(res, error.message);
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const data = await service.create(req.body);
            SubjectController.sendSuccess(res, data, 201);
        } catch (error: any) {
            SubjectController.sendError(res, error.message, 400);
        }
    }

    static update = async (req: Request, res: Response) => {
        try {
            const data = await service.update(req.params.id, req.body);
            SubjectController.sendSuccess(res, data);
        } catch (error: any) {
            SubjectController.sendError(res, error.message, 400);
        }
    }

    static delete = async (req: Request, res: Response) => {
        try {
            await service.delete(req.params.id);
            SubjectController.sendSuccess(res, null, 200, "Subject deleted");
        } catch (error: any) {
            SubjectController.sendError(res, error.message);
        }
    }
}
