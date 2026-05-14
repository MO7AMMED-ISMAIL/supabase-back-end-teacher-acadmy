import { BaseModel } from "./BaseModel";
import { AttendanceRecord } from "../types";
import { db } from "../config/database";

export class AttendanceRecordModel extends BaseModel<AttendanceRecord> {
    protected tableName = "attendance_records";

    async bulkCreate(records: Partial<AttendanceRecord>[]): Promise<AttendanceRecord[]> {
        const { data, error } = await db.from(this.tableName).insert(records as any[]).select();
        if (error) throw new Error(error.message);
        return (data as AttendanceRecord[]) ?? [];
    }
}
