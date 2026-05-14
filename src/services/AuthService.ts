import { db } from "../config/database";
import { ApiResponse } from "../types";

export class AuthService {
    /**
     * Login using email and password (Supabase built-in)
     */
    static async login(email: string, password: string) {
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            data: {
                user: data.user,
                session: data.session,
            },
        };
    }

    /**
     * Register a new user and create a profile
     * Note: This uses service role via `db` to create user without confirmation if needed,
     * or just regular signUp.
     */
    static async register(email: string, password: string, fullName: string, role: string) {
        // 1. Create user in Supabase Auth
        const { data, error } = await db.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role, full_name: fullName },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const user = data.user;

        // 2. Create profile in our profiles table
        const { error: profileError } = await db.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            role: role,
        });

        if (profileError) {
            // Cleanup: delete auth user if profile creation fails
            await db.auth.admin.deleteUser(user.id);
            return { success: false, error: profileError.message };
        }

        return {
            success: true,
            data: { user },
        };
    }

    static async logout(token: string) {
        // Supabase signout usually happens on frontend, but we can do it here
        // However, Supabase auth is mostly stateless via JWT.
        // We can use the client with the user's token to sign out.
        const { error } = await db.auth.signOut();
        if (error) return { success: false, error: error.message };
        return { success: true };
    }

    static async getCurrentUser(token: string) {
        const { data: { user }, error } = await db.auth.getUser(token);
        if (error) return { success: false, error: error.message };
        return { success: true, data: user };
    }
}
