import 'dotenv/config'
import express from "express";
import webRoutes from 'routes/web';
import initDatabase from './config/seed';
import passport from 'passport';
import configPassportLocal from './middleware/passport.local';
import session from 'express-session';
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views')

//config session 

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

//config passport
app.use(passport.initialize())
app.use(passport.authenticate('session'))
configPassportLocal()

//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config static files: images/css/js
app.use(express.static('public'))

//config routes
webRoutes(app)
// seeding data
initDatabase()

app.use((req, res) => {
    res.send("404 not found")
})
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on local http://localhost:${process.env.PORT}`)
})