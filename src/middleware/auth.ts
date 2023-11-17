import { Request, Response, NextFunction } from 'express';
import { JWT } from '../utils/jwt.js'; // Import your JWT library
import UserModel from '../models/User/user.model.js';
import { IUser } from '../models/User/interface.js';
declare global {
    namespace Express {
        interface Request {
            user: {
                role: string;
                id: any
            };
        }
    }
}
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined = req.headers.token as string;

    if (!token) {
        return res.status(401).json({
            error: 'Token not found'
        });
    }
    try {
        const { id } = JWT.VERIFY(token) as { id: string };
        const user: IUser | null = await (UserModel.findByPk(id) as any);
        if (user) {
            req.user = { ...req.user, role: user.role, id: user.id };
            next();
        } else {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }
}