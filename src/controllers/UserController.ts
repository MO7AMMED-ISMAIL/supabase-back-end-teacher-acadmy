import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";

export class UserController extends BaseController {
    private userService = new UserService();

    registerRoutes(): void { } // Handled in routes/user/index.ts

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAll();
            this.sendSuccess(res, users);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Failed to fetch users");
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.getById(req.params.id);
            if (!user) return void this.sendError(res, "User not found", 404);
            this.sendSuccess(res, user);
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.create(req.body);
            this.sendSuccess(res, user, 201, "User created");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.update(req.params.id, req.body);
            this.sendSuccess(res, user, 200, "User updated");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.userService.delete(req.params.id);
            this.sendSuccess(res, null, 200, "User deleted");
        } catch (err) {
            this.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}