import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { db } from "../config/database";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
    /**
     * Handle Dashboard Login (Admin/Teacher)
     */
    static dashboardLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return AuthController.sendError(res, "Email and password are required", 400);
            }

            const result = await AuthService.login(email, password);
            if (!result.success) {
                return res.status(401).json(result);
            }

            // Verify if user is Admin or Teacher
            const user = result.data?.user;
            const userRole = user?.user_metadata?.role;
            if (userRole !== "admin" && userRole !== "teacher") {
                return AuthController.sendError(res, "Access denied. Only Admins and Teachers can login here.", 403);
            }

            // Return simplified object
            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user?.id,
                        name: user?.user_metadata?.full_name,
                        role: userRole,
                        email: user?.email
                    },
                    token: result.data?.session?.access_token
                }
            });
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }

    /**
     * Handle Mobile Login (Student)
     */
    static mobileLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return AuthController.sendError(res, "Email and password are required", 400);
            }

            const result = await AuthService.login(email, password);
            if (!result.success) {
                return res.status(401).json(result);
            }

            // Verify if user is Student
            const user = result.data?.user;
            const userRole = user?.user_metadata?.role;
            if (userRole !== "student") {
                return AuthController.sendError(res, "Access denied. Only Students can login here.", 403);
            }

            // Return simplified object
            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user?.id,
                        name: user?.user_metadata?.full_name,
                        role: userRole,
                        email: user?.email
                    },
                    token: result.data?.session?.access_token
                }
            });
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }

    /**
     * Register a new user
     */
    static register = async (req: Request, res: Response) => {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name || !role) {
                return AuthController.sendError(res, "Missing required fields", 400);
            }

            const result = await AuthService.register(email, password, name, role);
            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }

    /**
     * Get current user profile
     */
    static me = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return AuthController.sendError(res, "No token provided", 401);

            const result = await AuthService.getCurrentUser(token);
            if (!result.success) return res.status(401).json(result);

            const user = result.data;
            return res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user?.id,
                        name: user?.user_metadata?.full_name,
                        role: user?.user_metadata?.role,
                        email: user?.email
                    }
                }
            });
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }

    /**
     * Logout
     */
    static logout = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return AuthController.sendError(res, "No token provided", 401);

            const result = await AuthService.logout(token);
            return res.status(200).json(result);
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }

    /**
     * Create Admin (One-time or protected)
     */
    static createAdmin = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;

            // Check if any admin exists
            const { count, error: countError } = await db
                .from("users")
                .select("*", { count: "exact", head: true })
                .eq("role", "admin");

            if (countError) return AuthController.sendError(res, countError.message);
            if (count && count > 0) {
                return AuthController.sendError(res, "Admin already exists. This route is for initial setup only.", 403);
            }

            const result = await AuthService.register(email, password, name, "admin");
            if (!result.success) return res.status(400).json(result);
            return res.status(201).json(result);
        } catch (error: any) {
            return AuthController.sendError(res, error.message);
        }
    }
}
