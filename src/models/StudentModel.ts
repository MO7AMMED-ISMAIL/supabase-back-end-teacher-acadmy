import { BaseModel } from "./BaseModel";
import { Student } from "../types";

export class StudentModel extends BaseModel<Student> {
    protected tableName = "students";
}
