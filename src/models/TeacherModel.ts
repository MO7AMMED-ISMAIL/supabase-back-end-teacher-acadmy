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
            .from(this.tableName)
            .select(`
                id,
                subject_specialization,
                phone,
                is_active,
                users (
                    id,
                    email,
                    role,
                    full_name
                )
            `)
            .eq("is_active", true);

        if (error) throw new Error(error.message);
        
        // Flatten the structure
        return (data as any[]).map(item => ({
            id: item.id,
            full_name: item.users?.full_name,
            email: item.users?.email,
            role: item.users?.role,
            subject_specialization: item.subject_specialization,
            phone: item.phone,
            is_active: item.is_active ?? true,
        }));
    }
}
