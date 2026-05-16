import { db } from "../config/database";

export class TeacherDashboardService {
    static async getTeacherDashboardData(teacherId: string) {
        const todayDayOfWeek = new Date().getDay();

        const [
            totalStudents,
            totalSubjects,
            todayClasses,
            recentAttendance,
            overallAttendanceRate
        ] = await Promise.all([
            // 1. Total unique students enrolled in teacher's subjects
            this.getTotalStudents(teacherId),

            // 2. Total subjects assigned to teacher
            db.from("teacher_subjects").select("*", { count: "exact", head: true })
                .eq("teacher_id", teacherId)
                .eq("is_active", true),

            // 3. Today's classes for the teacher
            this.getTodayClasses(teacherId, todayDayOfWeek),

            // 4. Recent attendance records
            this.getRecentAttendance(teacherId),

            // 5. Overall attendance rate for teacher's subjects
            this.getOverallAttendanceRate(teacherId)
        ]);

        return {
            totalStudents: totalStudents || 0,
            totalSubjects: totalSubjects.count || 0,
            todayClasses: todayClasses || [],
            recentAttendance: recentAttendance || [],
            overallAttendanceRate: overallAttendanceRate || 0
        };
    }

    private static async getTotalStudents(teacherId: string): Promise<number> {
        // Use a join to find students enrolled in any of this teacher's active subjects
        const { data, error } = await db.from("enrollments")
            .select(`
                student_id,
                teacher_subjects!inner (
                    teacher_id,
                    is_active
                )
            `)
            .eq("teacher_subjects.teacher_id", teacherId)
            .eq("teacher_subjects.is_active", true);
        
        if (error || !data) return 0;
        const uniqueStudents = new Set(data.map(d => d.student_id));
        return uniqueStudents.size;
    }

    private static async getTodayClasses(teacherId: string, dayOfWeek: number) {
        const { data } = await db.from("schedules")
            .select(`
                id,
                start_time,
                end_time,
                teacher_subjects!inner (
                    id,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .eq("teacher_subjects.teacher_id", teacherId)
            .eq("day_of_week", dayOfWeek)
            .eq("is_active", true);

        return data?.map(item => ({
            _id: item.id,
            startTime: item.start_time,
            endTime: item.end_time,
            subject: (item.teacher_subjects as any).subjects
        }));
    }

    private static async getRecentAttendance(teacherId: string) {
        const { data } = await db.from("attendance")
            .select(`
                id,
                date,
                teacher_subjects!inner (
                    id,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .eq("teacher_subjects.teacher_id", teacherId)
            .order("date", { ascending: false })
            .limit(5);

        if (!data) return [];

        // For each attendance, get present/total count
        const attendanceIds = data.map(a => a.id);
        if (attendanceIds.length === 0) return [];

        const { data: records } = await db.from("attendance_records")
            .select("attendance_id, status")
            .in("attendance_id", attendanceIds);

        return data.map(a => {
            const relatedRecords = records?.filter(r => r.attendance_id === a.id) || [];
            return {
                _id: a.id,
                date: a.date,
                subject: (a.teacher_subjects as any).subjects,
                totalCount: relatedRecords.length,
                presentCount: relatedRecords.filter(r => r.status === "present").length
            };
        });
    }

    private static async getOverallAttendanceRate(teacherId: string): Promise<number> {
        // Find all attendance records for this teacher's subjects
        const { data, error } = await db.from("attendance_records")
            .select(`
                status,
                attendance!inner (
                    teacher_subjects!inner (
                        teacher_id
                    )
                )
            `)
            .eq("attendance.teacher_subjects.teacher_id", teacherId);

        if (error || !data || data.length === 0) return 0;

        const total = data.length;
        const present = data.filter(r => r.status === "present").length;

        return Math.round((present / total) * 100);
    }
}
