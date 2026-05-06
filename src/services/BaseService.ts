import { BaseModel } from "../models/BaseModel";
import { QueryOptions } from "../types";

export abstract class BaseService<T> {
    protected abstract model: BaseModel<T>;

    async getAll(options?: QueryOptions): Promise<T[]> {
        return this.model.findAll(options);
    }

    async getById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async create(payload: Partial<T>): Promise<T> {
        return this.model.create(payload);
    }

    async update(id: string, payload: Partial<T>): Promise<T> {
        return this.model.update(id, payload);
    }

    async delete(id: string): Promise<boolean> {
        return this.model.delete(id);
    }

    async count(filters?: Record<string, unknown>): Promise<number> {
        return this.model.count(filters);
    }
}