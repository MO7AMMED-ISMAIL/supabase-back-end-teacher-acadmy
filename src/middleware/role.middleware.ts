import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";
import { ApiResponse } from "../types";

const userModel = new UserModel();

/**
 * Middleware to restrict access based on user roles.
 * Use AFTER authMiddleware.
 * 
 * @param allowedRoles - List of roles that are allowed to access the route.
 */
export const requireRole = (...allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Assuming authMiddleware attaches the decoded token to req.user
            const user = (req as any).user;

            if (!user || !user.id) {
                const response: ApiResponse = {
                    success: false,
                    error: "Unauthorized: User information missing from request",
                };
                return res.status(401).json(response);
            }

            // Fetch user from database to get the latest role
            const userData = await userModel.findById(user.id);

            if (!userData) {
                const response: ApiResponse = {
                    success: false,
                    error: "User not found",
                };
                return res.status(403).json(response);
            }

            const userRole = userData.role;

            if (!allowedRoles.includes(userRole)) {
                const response: ApiResponse = {
                    success: false,
                    error: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
                };
                return res.status(403).json(response);
            }

            // Attach role to request for use in controllers if needed
            (req as any).userRole = userRole;
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
