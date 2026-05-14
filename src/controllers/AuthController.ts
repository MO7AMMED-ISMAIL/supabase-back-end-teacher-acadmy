import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
    /**
     * Handle Dashboard Login (Admin/Teacher)
     */
    static async dashboardLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: "Email and password are required" });
            }

            const result = await AuthService.login(email, password);
            if (!result.success) {
                return res.status(401).json(result);
            }

            // Verify if user is Admin or Teacher
            const userRole = result.data?.user?.user_metadata?.role;
            if (userRole !== "admin" && userRole !== "teacher") {
                return res.status(403).json({ success: false, error: "Access denied. Only Admins and Teachers can login here." });
            }

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Handle Mobile Login (Student)
     */
    static async mobileLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, error: "Email and password are required" });
            }

            const result = await AuthService.login(email, password);
            if (!result.success) {
                return res.status(401).json(result);
            }

            // Verify if user is Student
            const userRole = result.data?.user?.user_metadata?.role;
            if (userRole !== "student") {
                return res.status(403).json({ success: false, error: "Access denied. Only Students can login here." });
            }

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Register a new user
     */
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;
            if (!email || !password || !name || !role) {
                return res.status(400).json({ success: false, error: "Missing required fields" });
            }

            const result = await AuthService.register(email, password, name, role);
            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Get current user profile
     */
    static async me(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ success: false, error: "No token provided" });

            const result = await AuthService.getCurrentUser(token);
            if (!result.success) return res.status(401).json(result);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Logout
     */
    static async logout(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ success: false, error: "No token provided" });

            const result = await AuthService.logout(token);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Create Admin (One-time or protected)
     */
    static async createAdmin(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            // In a real app, you might want to check if any admin exists first
            const result = await AuthService.register(email, password, name, "admin");
            if (!result.success) return res.status(400).json(result);
            return res.status(201).json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}
