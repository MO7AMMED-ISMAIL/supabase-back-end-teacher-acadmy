import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { StudentService } from "../services/StudentService";

const studentService = new StudentService();

export class StudentController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const students = await studentService.getAll();
            StudentController.sendSuccess(res, students);
        } catch (err) {
            StudentController.sendError(res, err instanceof Error ? err.message : "Failed to fetch students");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.getById(req.params.id);
            if (!student) {
                StudentController.sendError(res, "Student not found", 404);
                return;
            }
            StudentController.sendSuccess(res, student);
        } catch (err) {
            StudentController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.create(req.body);
            StudentController.sendSuccess(res, student, 201, "Student created");
        } catch (err) {
            StudentController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const student = await studentService.update(req.params.id, req.body);
            StudentController.sendSuccess(res, student, 200, "Student updated");
        } catch (err) {
            StudentController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await studentService.delete(req.params.id);
            StudentController.sendSuccess(res, null, 200, "Student deleted");
        } catch (err) {
            StudentController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
