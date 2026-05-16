import { BaseService } from "./BaseService";
import { Attendance, AttendanceRecord } from "../types";
import { AttendanceModel } from "../models/AttendanceModel";
import { AttendanceRecordModel } from "../models/AttendanceRecordModel";
import { db } from "../config/database";

export class AttendanceService extends BaseService<Attendance> {
    protected model = new AttendanceModel();
    private recordModel = new AttendanceRecordModel();

    async submitAttendance(payload: {
        teacherSubjectId: string;
        date: string;
        records: { studentId: string; status: "present" | "absent" | "late" }[];
    }): Promise<{ attendance: Attendance; records: AttendanceRecord[] }> {
        // 1. Create or get attendance record for the date and teacherSubject
        // Use upsert or find then create. The table has UNIQUE(teacher_subject_id, date)
        
        const { data: attendance, error } = await db
            .from("attendance")
            .upsert({
                teacher_subject_id: payload.teacherSubjectId,
                date: payload.date,
            }, { onConflict: "teacher_subject_id,date" })
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 2. Create attendance records for students
        const recordsToInsert = payload.records.map((r) => ({
            attendance_id: attendance.id,
            student_id: r.studentId,
            status: r.status,
        }));

        // Use upsert for records too to avoid duplicate student entries for same attendance
        const { data: records, error: recordsError } = await db
            .from("attendance_records")
            .upsert(recordsToInsert, { onConflict: "attendance_id,student_id" })
            .select();

        if (recordsError) throw new Error(recordsError.message);

        return { attendance: attendance as Attendance, records: records as AttendanceRecord[] };
    }

    async getSummary(teacherSubjectId?: string) {
        let query = db.from("attendance_records").select(`
            status,
            attendance!inner (
                teacher_subject_id
            )
        `);

        if (teacherSubjectId) {
            query = query.eq("attendance.teacher_subject_id", teacherSubjectId);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const summary = (data as any[]).reduce((acc: any, curr: any) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, { present: 0, absent: 0, late: 0 });

        return summary;
    }
}
