import express, { Express } from 'express'
import { fetchAccountAPI, getUserByID, getUsersAPI, loginAPI } from 'src/controllers/client/api.controller'
import { getProductsAPI } from 'src/controllers/client/product.controller'
import { checkValidJWT } from 'src/middleware/jwt.middleware'

const router = express.Router()

const apiRoutes = (app: Express) => {


    router.get("/users", getUsersAPI)
    router.get("/users/:id", getUserByID)
    router.post("/login", loginAPI)
    router.get("/account", fetchAccountAPI)
    router.get("/products", getProductsAPI)

    app.use("/api",checkValidJWT, router)
}



export default apiRoutes