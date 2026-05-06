import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

class DatabaseConfig {
    private static instance: DatabaseConfig;
    private client: SupabaseClient;

    private constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // Admin (service role) key — never expose to frontend

        if (!url || !key) {
            throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
        }

        this.client = createClient(url, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    // Singleton pattern — only one DB connection
    public static getInstance(): DatabaseConfig {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }

    public getClient(): SupabaseClient {
        return this.client;
    }
}

export const db = DatabaseConfig.getInstance().getClient();