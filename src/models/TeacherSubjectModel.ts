import { BaseModel } from "./BaseModel";
import { TeacherSubject } from "../types";

export class TeacherSubjectModel extends BaseModel<TeacherSubject> {
    protected tableName = "teacher_subjects";
}
