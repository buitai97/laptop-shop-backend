/// <reference path="./types/index.d.ts"/>
import 'dotenv/config'
import express from "express";
import webRoutes from 'routes/web';
import initDatabase from 'config/seed';
import passport from 'passport';
import configPassportLocal from 'middleware/passport.local';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import apiRoutes from 'routes/api';
import cors from 'cors'
import path from 'path'
import prisma from 'lib/prisma';


const app = express();

app.use(cors({
    origin: '*',
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
app.use((req, res, next) => {
    res.locals.user = req.user || null; // Pass user object to all views
    next();
});

// decode
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config static files: images/css/js
app.use(express.static(path.join(process.cwd(), 'public')))

//config routes
webRoutes(app)
apiRoutes(app)

// seeding data
if (process.env.NODE_ENV === 'development') {
    initDatabase()
}

app.use((_req, res) => res.status(404).render('status/404.ejs'))

export default app