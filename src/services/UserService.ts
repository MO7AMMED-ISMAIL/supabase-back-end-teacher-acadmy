import { BaseService } from "./BaseService";
import { User } from "../types";
import { UserModel } from "../models/UserModel";

export class UserService extends BaseService<User> {
    protected model = new UserModel();

    async findByEmail(email: string): Promise<User | null> {
        return (this.model as UserModel).findByEmail(email);
    }
}
