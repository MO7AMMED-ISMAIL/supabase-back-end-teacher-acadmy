import { BaseService } from "./BaseService";
import { ITeacher, TeacherModel } from "../models/TeacherModel";
import { AuthService } from "./AuthService";
import { db } from "../config/database";

export class TeacherService extends BaseService<ITeacher> {
    protected model = new TeacherModel();

    async getAllTeachers() {
        return (this.model as TeacherModel).findAllTeachers();
    }

    async create(payload: any): Promise<ITeacher> {
        // 1. Map user fields for Auth
        const { email, password, full_name, subject_specialization, phone } = payload;

        // 2. Create in Auth (this will trigger profile creation in 'users' table)
        const authResult = await AuthService.register(email, password, full_name, "teacher");
        if (!authResult.success || !authResult.data?.user) {
            throw new Error(authResult.error || "Failed to create teacher account");
        }

        const userId = authResult.data.user.id;

        // 3. Map teacher fields
        const teacherData = {
            id: userId,
            subject_specialization: subject_specialization || null,
            phone: phone || null,
            is_active: true
        };

        // 4. Insert into 'teachers' table
        return this.model.create(teacherData as any);
    }

    async update(id: string, payload: any): Promise<ITeacher> {
        const { full_name, subject_specialization, phone, is_active } = payload;

        // 1. Update user profile if full_name is provided
        if (full_name) {
            const { error: userError } = await db
                .from("users")
                .update({ full_name })
                .eq("id", id);
            
            if (userError) throw new Error(userError.message);
        }

        // 2. Map teacher fields
        const teacherData: any = {};
        if (subject_specialization !== undefined) teacherData.subject_specialization = subject_specialization;
        if (phone !== undefined) teacherData.phone = phone;
        if (is_active !== undefined) teacherData.is_active = is_active;

        // 3. Update 'teachers' table
        if (Object.keys(teacherData).length > 0) {
            await this.model.update(id, teacherData);
        }

        // Return the updated teacher (fetched via model or constructed)
        const updated = await this.getById(id);
        if (!updated) throw new Error("Teacher not found after update");
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        // 1. Delete from Auth (this will cascade to 'users' and then to 'teachers')
        const { error } = await db.auth.admin.deleteUser(id);
        if (error) throw new Error(error.message);

        return true;
    }
}
