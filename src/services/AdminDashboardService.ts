import { db } from "../config/database";

export class AdminDashboardService {
    static async getDashboardData() {
        const todayDayOfWeek = new Date().getDay();

        const [
            teachersActive, teachersInactive,
            subjectsActive, subjectsInactive,
            assignmentsActive, assignmentsInactive,
            studentsActive, studentsInactive,
            enrollmentsCount, // Enrollments don't have isActive in schema, but we can check if they exist
            todayClassesCount,
            attendanceStats,
            teachersWithoutSubjects,
            subjectsWithoutTeachers
        ] = await Promise.all([
            // Teachers (Users with role 'teacher')
            // Note: isActive is in 'teachers' table
            db.from("teachers").select("*", { count: "exact", head: true }).eq("is_active", true),
            db.from("teachers").select("*", { count: "exact", head: true }).eq("is_active", false),

            // Subjects
            db.from("subjects").select("*", { count: "exact", head: true }).eq("is_active", true),
            db.from("subjects").select("*", { count: "exact", head: true }).eq("is_active", false),

            // Assignments (Teacher Subjects)
            db.from("teacher_subjects").select("*", { count: "exact", head: true }).eq("is_active", true),
            db.from("teacher_subjects").select("*", { count: "exact", head: true }).eq("is_active", false),

            // Students
            db.from("students").select("*", { count: "exact", head: true }).eq("is_active", true),
            db.from("students").select("*", { count: "exact", head: true }).eq("is_active", false),

            // Enrollments
            db.from("enrollments").select("*", { count: "exact", head: true }),

            // Today Classes
            db.from("schedules").select("*", { count: "exact", head: true })
                .eq("is_active", true)
                .eq("day_of_week", todayDayOfWeek),

            // Attendance Stats
            this.getAttendanceStats(),

            // Teachers without subjects (Alerts)
            this.getTeachersWithoutSubjects(),

            // Subjects without teachers (Alerts)
            this.getSubjectsWithoutTeachers()
        ]);

        const overallAttendanceRate = attendanceStats.total > 0
            ? Math.round((attendanceStats.present / attendanceStats.total) * 1000) / 10
            : 0;

        return {
            totals: {
                teachers: { active: teachersActive.count || 0, inactive: teachersInactive.count || 0 },
                subjects: { active: subjectsActive.count || 0, inactive: subjectsInactive.count || 0 },
                assignments: { active: assignmentsActive.count || 0, inactive: assignmentsInactive.count || 0 },
                students: { active: studentsActive.count || 0, inactive: studentsInactive.count || 0 },
                enrollments: { active: enrollmentsCount.count || 0, inactive: 0 }, // Schema doesn't have isActive for enrollments
            },
            todayClassesCount: todayClassesCount.count || 0,
            overallAttendanceRate,
            alerts: {
                teachersWithoutSubjects,
                subjectsWithoutTeachers,
            },
        };
    }

    private static async getAttendanceStats() {
        const { data: totalData } = await db.from("attendance_records").select("status");
        if (!totalData) return { total: 0, present: 0 };

        const total = totalData.length;
        const present = totalData.filter(r => r.status === "present").length;

        return { total, present };
    }

    private static async getTeachersWithoutSubjects() {
        // Teachers who don't have any active teacher_subjects
        const { data: teachers } = await db.from("users")
            .select("id, full_name")
            .eq("role", "teacher");

        if (!teachers) return [];

        const { data: assignments } = await db.from("teacher_subjects")
            .select("teacher_id")
            .eq("is_active", true);

        const assignedTeacherIds = new Set(assignments?.map(a => a.teacher_id) || []);

        return teachers
            .filter(t => !assignedTeacherIds.has(t.id))
            .slice(0, 10)
            .map(t => ({ _id: t.id, name: t.full_name }));
    }

    private static async getSubjectsWithoutTeachers() {
        // Subjects that don't have any active teacher_subjects
        const { data: subjects } = await db.from("subjects")
            .select("id, name")
            .eq("is_active", true);

        if (!subjects) return [];

        const { data: assignments } = await db.from("teacher_subjects")
            .select("subject_id")
            .eq("is_active", true);

        const assignedSubjectIds = new Set(assignments?.map(a => a.subject_id) || []);

        return subjects
            .filter(s => !assignedSubjectIds.has(s.id))
            .slice(0, 10)
            .map(s => ({ _id: s.id, name: s.name }));
    }
}
