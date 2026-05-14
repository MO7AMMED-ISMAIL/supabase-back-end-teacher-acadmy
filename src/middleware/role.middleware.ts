import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

/**
 * Middleware to restrict access based on user roles.
 * Use AFTER authMiddleware.
 * 
 * @param allowedRoles - List of roles that are allowed to access the route.
 */
export const requireRole = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Assuming authMiddleware attaches the Supabase user to req.user
            const user = (req as any).user;

            if (!user) {
                const response: ApiResponse = {
                    success: false,
                    error: "Unauthorized: User information missing from request",
                };
                return res.status(401).json(response);
            }

            // Get role from Supabase user metadata
            const userRole = user.user_metadata?.role;

            if (!userRole || !allowedRoles.includes(userRole)) {
                const response: ApiResponse = {
                    success: false,
                    error: `Access denied. Your role: ${userRole ?? 'none'}. Required role: ${allowedRoles.join(" or ")}`,
                };
                return res.status(403).json(response);
            }

            next();
        } catch (err: any) {
            const response: ApiResponse = {
                success: false,
                error: `Role check failed: ${err.message}`,
            };
            return res.status(500).json(response);
        }
    };
};
