import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await userService.getAll();
            this.sendSuccess(res, users);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch users");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return void this.sendError(res, "User not found", 404);
            this.sendSuccess(res, user);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.create(req.body);
            this.sendSuccess(res, user, 201, "User created");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.update(req.params.id, req.body);
            this.sendSuccess(res, user, 200, "User updated");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await userService.delete(req.params.id);
            this.sendSuccess(res, null, 200, "User deleted");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}