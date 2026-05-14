import { BaseModel } from "./BaseModel";
import { Schedule } from "../types";

export class ScheduleModel extends BaseModel<Schedule> {
    protected tableName = "schedules";
}
