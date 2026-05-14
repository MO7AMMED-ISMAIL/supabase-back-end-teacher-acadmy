import { BaseService } from "./BaseService";
import { ISubject, SubjectModel } from "../models/SubjectModel";

export class SubjectService extends BaseService<ISubject> {
    protected model = new SubjectModel();
}
