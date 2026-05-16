import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { TeacherSubjectService } from "../services/TeacherSubjectService";

const teacherSubjectService = new TeacherSubjectService();

export class TeacherSubjectController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignments = await teacherSubjectService.getAll();
            TeacherSubjectController.sendSuccess(res, assignments);
        } catch (err) {
            TeacherSubjectController.sendError(res, err instanceof Error ? err.message : "Failed to fetch assignments");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.getById(req.params.id);
            if (!assignment) {
                TeacherSubjectController.sendError(res, "Assignment not found", 404);
                return;
            }
            TeacherSubjectController.sendSuccess(res, assignment);
        } catch (err) {
            TeacherSubjectController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.create(req.body);
            TeacherSubjectController.sendSuccess(res, assignment, 201, "Assignment created");
        } catch (err) {
            TeacherSubjectController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await teacherSubjectService.update(req.params.id, req.body);
            TeacherSubjectController.sendSuccess(res, assignment, 200, "Assignment updated");
        } catch (err) {
            TeacherSubjectController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await teacherSubjectService.delete(req.params.id);
            TeacherSubjectController.sendSuccess(res, null, 200, "Assignment deleted");
        } catch (err) {
            TeacherSubjectController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
