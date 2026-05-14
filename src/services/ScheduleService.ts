import { BaseService } from "./BaseService";
import { Schedule } from "../types";
import { ScheduleModel } from "../models/ScheduleModel";

export class ScheduleService extends BaseService<Schedule> {
    protected model = new ScheduleModel();
}
