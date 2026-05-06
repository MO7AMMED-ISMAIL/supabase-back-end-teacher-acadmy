import { db } from "../config/database";
import { QueryOptions, RawQueryResult } from "../types";

/**
 * Execute any raw SQL query via Supabase RPC.
 * Your Supabase project must have a function named `execute_query` (see note below).
 */
export async function executeRawQuery<T = unknown>(
    sql: string,
    params?: unknown[]
): Promise<RawQueryResult<T>> {
    try {
        const { data, error } = await db.rpc("execute_query", {
            query_text: sql,
            query_params: params ?? [],
        });

        if (error) return { data: null, error: error.message };
        return { data: data as T[], error: null };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { data: null, error: message };
    }
}

/**
 * General-purpose SELECT helper with filters, ordering, and pagination.
 */
export async function queryTable<T = unknown>(
    table: string,
    options: QueryOptions = {}
): Promise<{ data: T[] | null; error: string | null }> {
    try {
        let query = db.from(table).select(options.select ?? "*");

        if (options.filters) {
            for (const [key, value] of Object.entries(options.filters)) {
                query = query.eq(key, value);
            }
        }

        if (options.orderBy) {
            query = query.order(options.orderBy.column, {
                ascending: options.orderBy.ascending ?? true,
            });
        }

        if (options.limit !== undefined) query = query.limit(options.limit);
        if (options.offset !== undefined) query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);

        const { data, error } = await query;
        if (error) return { data: null, error: error.message };
        return { data: data as T[], error: null };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { data: null, error: message };
    }
}