import { Request, Response, NextFunction } from 'express';

// Middleware to check if the user is a super admin
const superAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user // Assuming you have a user object attached to the request
    if (user && user.role === "super_admin") {
        next(); // User is a super admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: "Access denied. Super admin access required." });
    }
};

// Middleware to check if the user is a product admin
const productAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming you have a user object attached to the request
    if (user && (user.role === "super_admin" || user.role === "product_admin")) {
        next(); // User is a super admin or product admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: "Access denied. Super admin or product admin access required." });
    }
};
export {
    superAdminMiddleware,
    productAdminMiddleware
}