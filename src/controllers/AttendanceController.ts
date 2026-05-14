import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { AttendanceService } from "../services/AttendanceService";

const attendanceService = new AttendanceService();

export class AttendanceController extends BaseController {
    registerRoutes(): void { }

    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const attendance = await attendanceService.getAll();
            res.status(200).json({ success: true, data: attendance });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Failed to fetch attendance" });
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const attendance = await attendanceService.getById(req.params.id);
            if (!attendance) {
                res.status(404).json({ success: false, error: "Attendance record not found" });
                return;
            }
            res.status(200).json({ success: true, data: attendance });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
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
            
            res.status(201).json({ success: true, data: result, message: "Attendance submitted successfully" });
        } catch (err) {
            res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };

    static getSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const summary = await attendanceService.getSummary();
            res.status(200).json({ success: true, data: summary });
        } catch (err) {
            res.status(500).json({ success: false, error: err instanceof Error ? err.message : "Error" });
        }
    };
}
