import 'dotenv/config'
import express from "express";
import webRoutes from 'routes/web';
import initDatabase from './config/seed';
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

webRoutes(app)

initDatabase()

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
})