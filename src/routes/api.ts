import express, { Express } from 'express'
import { fetchAccountAPI, getUserByID, getUsersAPI, loginAPI, registerAPI } from '../controllers/users.controller'
import { getProductByIdAPI, getProductsAPI } from '../controllers/product.controller'
import { checkValidJWT } from '../middleware/jwt.middleware'
import { postDeleteUser } from '../controllers/users.controller'

const router = express.Router()

const apiRoutes = (app: Express) => {

    // users
    router.get("/users", getUsersAPI)
    router.get("/users/:id", getUserByID)
    router.delete("/users/:id", postDeleteUser)

    router.post("/register", registerAPI)
    router.post("/login", loginAPI)
    router.get("/account", fetchAccountAPI)

    //products
    router.get("/products", getProductsAPI)
    router.get("/products/:id", getProductByIdAPI)
    app.use("/api", checkValidJWT, router)

    // orders
}



export default apiRoutes