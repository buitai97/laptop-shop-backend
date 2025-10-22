/// <reference path="./types/index.d.ts"/>
import 'dotenv/config'
import express, { Express, NextFunction, Request, Response } from "express";
import webRoutes from './routes/web';
import passport from 'passport';
import configPassportLocal from './middleware/passport.local';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import apiRoutes from './routes/api';
import cors from 'cors'
import path from 'path'
import prisma from './lib/prisma';
import initDatabase from './config/seed';


const app: Express = express();

app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src', 'views'))


//config session 

app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        secure: 'auto',
        sameSite: 'lax'
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,  //ms
            dbRecordIdIsSessionId: true,
        }
    )
}))


//config passport
app.use(passport.initialize())
app.use(passport.authenticate('session'))
configPassportLocal()

// config global
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user || null;
    next();
});

// decode
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config static files: images/css/js
app.use(express.static(path.join(process.cwd(), 'public')))

app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

//config routes
webRoutes(app)
apiRoutes(app)


// seeding data
if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    initDatabase();
}
app.use((_req: Request, res: Response) => {
    res.status(404).render('status/404.ejs');
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
//app.use((_req, res) => res.status(404).render('status/404.ejs'))

export default app