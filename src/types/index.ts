export interface User {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface Student {
    id: string;
    full_name: string;
    address?: string;
    phone?: string;
    parent_phone?: string;
    notes?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface TeacherSubject {
    id: string;
    teacher_id: string;
    subject_id: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Enrollment {
    id: string;
    student_id: string;
    teacher_subject_id: string;
    created_at?: string;
}

export interface Schedule {
    id: string;
    teacher_subject_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Attendance {
    id: string;
    teacher_subject_id: string;
    date: string;
    created_at?: string;
}

export interface AttendanceRecord {
    id: string;
    attendance_id: string;
    student_id: string;
    status: 'present' | 'absent' | 'late';
    created_at?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface QueryOptions {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: {
        column: string;
        ascending?: boolean;
    };
    limit?: number;
    offset?: number;
}

export interface RawQueryResult<T = any> {
    data: T[] | null;
    error: string | null;
}
