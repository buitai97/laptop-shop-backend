import express, { Express } from 'express'
import { fetchAccountAPI, getUserByID, getUsersAPI, loginAPI, registerAPI } from 'src/controllers/client/api.controller'
import { postLogOut } from 'src/controllers/client/auth.controller'
import { getProductAPI, getProductsAPI } from 'src/controllers/client/product.controller'
import { checkValidJWT } from 'src/middleware/jwt.middleware'

const router = express.Router()

const apiRoutes = (app: Express) => {

    // users
    router.get("/users", getUsersAPI)
    router.get("/users/:id", getUserByID)

    router.post("/register", registerAPI)
    router.post("/login", loginAPI)
    router.post('/logout', postLogOut);
    router.get("/account", fetchAccountAPI)

    //products
    router.get("/products", getProductsAPI)
    router.get("/products/:id", getProductAPI)
    app.use("/api", checkValidJWT, router)
}



export default apiRoutes