import { db } from "../config/database";

export class TeacherDashboardService {
    static async getDashboardData(teacherId: string) {
        const today = new Date().getDay(); // 0 = Sun ... 6 = Sat

        // Step 1: teacher's active subject assignments (with subject names)
        const { data: tsList, error: tsErr } = await db
            .from("teacher_subjects")
            .select("id, subjects(id, name)")
            .eq("teacher_id", teacherId)
            .eq("is_active", true);

        if (tsErr) throw new Error(tsErr.message);

        const tsIds = (tsList || []).map((ts: any) => ts.id);
        const subjectByTsId = new Map<string, string>();
        (tsList || []).forEach((ts: any) => {
            subjectByTsId.set(ts.id, ts.subjects?.name ?? "—");
        });

        if (tsIds.length === 0) {
            return {
                totalStudents: 0,
                totalSubjects: 0,
                todayClasses: [],
                overallAttendanceRate: 0,
                recentAttendance: [],
            };
        }

        // Step 2: parallel queries
        const [enrollmentsRes, schedulesRes, allAttendancesRes, recentAttendancesRes] = await Promise.all([
            db.from("enrollments")
                .select("student_id")
                .in("teacher_subject_id", tsIds),

            db.from("schedules")
                .select("id, start_time, end_time, teacher_subject_id")
                .in("teacher_subject_id", tsIds)
                .eq("day_of_week", today)
                .eq("is_active", true),

            db.from("attendances")
                .select("id")
                .in("teacher_subject_id", tsIds),

            db.from("attendances")
                .select("id, date, teacher_subject_id")
                .in("teacher_subject_id", tsIds)
                .order("date", { ascending: false })
                .limit(5),
        ]);

        const totalStudents = new Set(
            (enrollmentsRes.data || []).map((e: any) => e.student_id)
        ).size;

        const todayClasses = (schedulesRes.data || []).map((s: any) => ({
            _id: s.id,
            subject: { name: subjectByTsId.get(s.teacher_subject_id) ?? "—" },
            startTime: s.start_time,
            endTime: s.end_time,
        }));

        // Step 3: attendance records (one call covers both rate + recent breakdown)
        const allAttendanceIds = (allAttendancesRes.data || []).map((a: any) => a.id);
        let overallAttendanceRate = 0;
        let recentAttendance: any[] = [];

        if (allAttendanceIds.length > 0) {
            const { data: records } = await db
                .from("attendance_records")
                .select("attendance_id, status")
                .in("attendance_id", allAttendanceIds);

            const recs = records || [];

            // Overall rate
            const present = recs.filter((r: any) => r.status === "present").length;
            overallAttendanceRate = recs.length > 0
                ? Math.round((present / recs.length) * 1000) / 10
                : 0;

            // Per-session counts for recent attendance
            const recentIds = new Set(
                (recentAttendancesRes.data || []).map((a: any) => a.id)
            );
            const countMap = new Map<string, { present: number; total: number }>();
            recs
                .filter((r: any) => recentIds.has(r.attendance_id))
                .forEach((r: any) => {
                    if (!countMap.has(r.attendance_id)) {
                        countMap.set(r.attendance_id, { present: 0, total: 0 });
                    }
                    const entry = countMap.get(r.attendance_id)!;
                    entry.total++;
                    if (r.status === "present") entry.present++;
                });

            recentAttendance = (recentAttendancesRes.data || []).map((a: any) => ({
                _id: a.id,
                subject: { name: subjectByTsId.get(a.teacher_subject_id) ?? "—" },
                date: a.date,
                presentCount: countMap.get(a.id)?.present ?? 0,
                totalCount: countMap.get(a.id)?.total ?? 0,
            }));
        }

        return {
            totalStudents,
            totalSubjects: tsIds.length,
            todayClasses,
            overallAttendanceRate,
            recentAttendance,
        };
    }
}
