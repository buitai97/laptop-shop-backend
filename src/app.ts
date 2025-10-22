/// <reference path="./types/index.d.ts"/>
import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import apiRoutes from './routes/api';
import cors from 'cors'
import path from 'path'
import initDatabase from './config/seed';


const app: Express = express();

const allowedOrigins = [
  'https://tech-shop-frontend-five.vercel.app', // your frontend domain
  'http://localhost:5173',                      // for local development
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
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