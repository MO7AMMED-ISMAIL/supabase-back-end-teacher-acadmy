import { BaseModel } from "./BaseModel";
import { Attendance } from "../types";

export class AttendanceModel extends BaseModel<Attendance> {
    protected tableName = "attendance";
}
