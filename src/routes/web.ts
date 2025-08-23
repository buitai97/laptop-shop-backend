import express, { Express } from "express";
import { postDeleteUser, getHomePage, postCreateUser, getUserDetail, postUpdateUser } from "controllers/user.controller";
import { getAdminCreateUserPage, getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashBoard } from "src/controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getAdminCreateProductPage, getProductDetailPage, getProductPage, postAdminCreateProduct, postAdminUpdateProductPage, postDeleteProduct } from "src/controllers/client/product.controller";
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postRegister } from "src/controllers/client/auth.controller";
import passport from "passport";
import { isLoggedIn, logOut } from "src/middleware/auth";

const router = express.Router()

const webRoutes = (app: Express) => {
    //client routes
    router.get('/', getHomePage)
    router.get("/product/:id", getProductPage)
    router.get("/success-redirect", getSuccessRedirectPage)
    router.get("/register", getRegisterPage)
    router.get("/login", isLoggedIn, getLoginPage)
    router.post("/register", postRegister)
    router.post("/login", passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',
        failureMessage: true
    }))
    app.post('/logout', logOut);


    //admin routes
    //Products
    router.get("/admin", getDashBoard)
    router.get("/admin/product", getAdminProductPage)
    router.get("/admin/create-product", getAdminCreateProductPage)
    router.post("/admin/create-product", fileUploadMiddleware("image", "images/product"), postAdminCreateProduct)
    router.post("/admin/delete-product/:id", postDeleteProduct)
    router.get("/admin/view-product-detail/:id", getProductDetailPage)
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postAdminUpdateProductPage)



    router.get("/admin/order", getAdminOrderPage)
    router.get("/admin/user", getAdminUserPage)
    router.get("/admin/create-user", getAdminCreateUserPage)
    router.get("/admin/view-user-detail/:id", getUserDetail)
    router.post("/admin/delete-user/:id", postDeleteUser)
    router.post("/admin/create-user", fileUploadMiddleware('avatar'), postCreateUser)
    router.post("/admin/update-user", fileUploadMiddleware("avatar"), postUpdateUser)



    app.use("/", router)

}

export default webRoutes

