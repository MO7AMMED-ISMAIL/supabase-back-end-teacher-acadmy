import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController extends BaseController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await userService.getAll();
            UserController.sendSuccess(res, users);
        } catch (err) {
            UserController.sendError(res, err instanceof Error ? err.message : "Failed to fetch users");
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return void UserController.sendError(res, "User not found", 404);
            UserController.sendSuccess(res, user);
        } catch (err) {
            UserController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.create(req.body);
            UserController.sendSuccess(res, user, 201, "User created");
        } catch (err) {
            UserController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await userService.update(req.params.id, req.body);
            UserController.sendSuccess(res, user, 200, "User updated");
        } catch (err) {
            UserController.sendError(res, err instanceof Error ? err.message : "Error", 400);
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await userService.delete(req.params.id);
            UserController.sendSuccess(res, null, 200, "User deleted");
        } catch (err) {
            UserController.sendError(res, err instanceof Error ? err.message : "Error");
        }
    };
}