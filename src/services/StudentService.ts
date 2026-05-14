import { BaseService } from "./BaseService";
import { Student } from "../types";
import { StudentModel } from "../models/StudentModel";

export class StudentService extends BaseService<Student> {
    protected model = new StudentModel();
}
