import { BaseModel } from "./BaseModel";
import { db } from "../config/database";

export interface ITeacher {
    id: string;
    full_name: string;
    email: string;
    role: string;
    subject_specialization?: string;
    phone?: string;
    is_active: boolean;
}

export class TeacherModel extends BaseModel<ITeacher> {
    protected tableName = "teachers";

    async findAllTeachers(): Promise<ITeacher[]> {
        const { data, error } = await db
            .from("profiles")
            .select(`
                id,
                full_name,
                email,
                role,
                teachers (
                    subject_specialization,
                    phone,
                    is_active
                )
            `)
            .eq("role", "teacher");

        if (error) throw new Error(error.message);
        
        // Flatten the structure
        return (data as any[]).map(item => ({
            id: item.id,
            full_name: item.full_name,
            email: item.email,
            role: item.role,
            subject_specialization: item.teachers?.[0]?.subject_specialization,
            phone: item.teachers?.[0]?.phone,
            is_active: item.teachers?.[0]?.is_active ?? true,
        }));
    }
}
