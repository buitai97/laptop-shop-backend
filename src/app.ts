/// <reference path="./types/index.d.ts"/>
import 'dotenv/config'
import express, { Express, NextFunction, Request, Response } from "express";
import apiRoutes from './routes/api';
import path from 'path'
import initDatabase from './config/seed';
import cors from 'cors'


const app: Express = express();

const allowedOrigins = [
    'https://techshop-alpha.vercel.app',
    'http://localhost:5173',
    'https://techshop-git-main-tai-buis-projects-0c7c002a.vercel.app/',
    'https://techshop-9cx5z4thu-tai-buis-projects-0c7c002a.vercel.app/'

];
app.use(cors({
    origin: allowedOrigins,

}))
// app.use((req: Request, res: Response, next: NextFunction) => {
//     const origin = req.headers.origin;
//     if (origin && allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');

//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200); 
//     }

//     next();
// });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app