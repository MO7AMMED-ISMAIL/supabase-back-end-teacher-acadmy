import { BaseService } from "./BaseService";
import { Enrollment } from "../types";
import { EnrollmentModel } from "../models/EnrollmentModel";

export class EnrollmentService extends BaseService<Enrollment> {
    protected model = new EnrollmentModel();
}
