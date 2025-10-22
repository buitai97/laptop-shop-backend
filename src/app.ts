/// <reference path="./types/index.d.ts"/>
import 'dotenv/config'
import express, { Express, NextFunction, Request, Response } from "express";
import apiRoutes from './routes/api';
import cors from 'cors'
import path from 'path'
import initDatabase from './config/seed';


const app: Express = express();

const allowedOrigins = [
    'https://tech-shop-frontend-five.vercel.app',
    'http://localhost:5173',
];

app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // ✅ Handle preflight
    }

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
apiRoutes(app)
// seeding data
if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    initDatabase();
}

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
//app.use((_req, res) => res.status(404).render('status/404.ejs'))

export default app