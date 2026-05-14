import { BaseService } from "./BaseService";
import { ITeacher, TeacherModel } from "../models/TeacherModel";

export class TeacherService extends BaseService<ITeacher> {
    protected model = new TeacherModel();

    async getAllTeachers() {
        return (this.model as TeacherModel).findAllTeachers();
    }
}
