// src/middleware/checkJWT.ts
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface JWTPayload {
    id: number;
    username: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    accountType: string;
    avatar: string;
    roleId: number;
    role: any; // You can use `Role` from @prisma/client if defined
}

const whiteList: (string | RegExp)[] = [
    '/login',
    '/products',
    /^\/products\/[^/]+$/
];

export const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const isWhiteList = whiteList.some(route =>
        route instanceof RegExp ? route.test(req.path) : route === req.path
    );

    if (isWhiteList) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;

        req.user = {
            id: decoded.id,
            username: decoded.username,
            name: decoded.name,
            address: decoded.address,
            email: decoded.email,
            phone: decoded.phone,
            accountType: decoded.accountType,
            avatar: decoded.avatar,
            roleId: decoded.roleId,
            role: decoded.role,
        };

        next();
    } catch (err: any) {
        return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
    }
};
