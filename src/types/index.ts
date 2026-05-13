export interface User {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface QueryOptions {
    select?: string;
    filters?: Record<string, any>;
    orderBy?: {
        column: string;
        ascending?: boolean;
    };
    limit?: number;
    offset?: number;
}

export interface RawQueryResult<T = any> {
    data: T[] | null;
    error: string | null;
}
