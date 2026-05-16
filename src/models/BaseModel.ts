import { db } from "../config/database";
import { QueryOptions } from "../types";

export abstract class BaseModel<T> {
    protected abstract tableName: string;

    async findAll(options: QueryOptions = {}): Promise<T[]> {
        let query = db.from(this.tableName).select(options.select ?? "*");

        if (options.filters) {
            for (const [key, value] of Object.entries(options.filters)) {
                query = query.eq(key, value);
            }
        }
        if (options.orderBy) {
            query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
        }
        if (options.limit) query = query.limit(options.limit);

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        
        return ((data as any[]) ?? []).map(item => ({
            ...item,
            _id: item.id
        })) as T[];
    }

    async findById(id: string): Promise<T | null> {
        const { data, error } = await db.from(this.tableName).select("*").eq("id", id).single();
        if (error) throw new Error(error.message);
        if (!data) return null;
        return { ...data, _id: (data as any).id } as T;
    }

    async create(payload: Partial<T>): Promise<T> {
        const { data, error } = await db.from(this.tableName).insert(payload as any).select().single();
        if (error) throw new Error(error.message);
        return { ...data, _id: (data as any).id } as T;
    }

    async update(id: string, payload: Partial<T>): Promise<T> {
        const { data, error } = await db.from(this.tableName).update(payload as any).eq("id", id).select().single();
        if (error) throw new Error(error.message);
        return { ...data, _id: (data as any).id } as T;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await db.from(this.tableName).delete().eq("id", id);
        if (error) throw new Error(error.message);
        return true;
    }

    async count(filters?: Record<string, unknown>): Promise<number> {
        let query = db.from(this.tableName).select("*", { count: "exact", head: true });
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                query = query.eq(key, value);
            }
        }
        const { count, error } = await query;
        if (error) throw new Error(error.message);
        return count ?? 0;
    }
}