import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AttendanceService } from "../services/AttendanceService";

const attendanceService = new AttendanceService();

export class AttendanceController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const attendance = await attendanceService.getAll();
            this.sendSuccess(res, attendance);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch attendance");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const attendance = await attendanceService.getById(req.params.id);
            if (!attendance) {
                this.sendError(res, "Attendance record not found", 404);
                return;
            }
            this.sendSuccess(res, attendance);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static submitAttendance = async (req: Request, res: Response): Promise<void> => {
        try {
            const { teacherSubject, date, records } = req.body;
            
            const result = await attendanceService.submitAttendance({
                teacherSubjectId: teacherSubject,
                date,
                records: records.map((r: any) => ({
                    studentId: r.student,
                    status: r.status
                }))
            });
            
            this.sendSuccess(res, result, 201, "Attendance submitted successfully");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static getSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const summary = await attendanceService.getSummary();
            this.sendSuccess(res, summary);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}
