import { BaseService } from "./BaseService";
import { TeacherSubject } from "../types";
import { TeacherSubjectModel } from "../models/TeacherSubjectModel";

export class TeacherSubjectService extends BaseService<TeacherSubject> {
    protected model = new TeacherSubjectModel();
}
