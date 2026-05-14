import { BaseModel } from "./BaseModel";
import { Enrollment } from "../types";

export class EnrollmentModel extends BaseModel<Enrollment> {
    protected tableName = "enrollments";
}
