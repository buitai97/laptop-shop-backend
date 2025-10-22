import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Express, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cors from 'cors';

const prisma = new PrismaClient();
const app: Express = express();

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    },
    secret: process.env.SESSION_SECRET || 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
    })
}));

// Passport (only if configPassportLocal is simple)
app.use(passport.initialize());
app.use(passport.authenticate('session'));

// Simple test routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running' });
});

// Export handler for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
    return app(req, res);
};