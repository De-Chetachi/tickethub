import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

interface UserData {
    id: string;
    email: string;
    username: string;
}

declare global {
    namespace Express{
        interface Request {
            currentUser?: UserData;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.token) {
        return next();
    }
    try {
        const userData = Jwt.verify(req.session.token, process.env.JWT_TOKEN!) as UserData;
        req.currentUser = userData;
    } catch (err) {
        
    } finally {
        next();
    }
}