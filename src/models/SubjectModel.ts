import { BaseModel } from "./BaseModel";

export interface ISubject {
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export class SubjectModel extends BaseModel<ISubject> {
    protected tableName = "subjects";
}
