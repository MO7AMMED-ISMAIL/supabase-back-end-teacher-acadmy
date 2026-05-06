import { BaseModel } from "./BaseModel";
import { User } from "../types";

export class UserModel extends BaseModel<User> {
    protected tableName = "users";

    // Custom method specific to users
    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await (await import("../config/database")).db
            .from(this.tableName)
            .select("*")
            .eq("email", email)
            .single();

        if (error) return null;
        return data as User;
    }
}