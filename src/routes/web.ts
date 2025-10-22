import express, { Express } from "express";
import { postDeleteUser, getHomePage, postCreateUser, getUserDetail, postUpdateUser } from "controllers/user.controller";
import { getAdminCreateUserPage, getAdminOrderDetailPage, getAdminOrderPage, getAdminProductPage, getAdminUserPage, getDashBoard } from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "middleware/multer";
import { getAdminCreateProductPage, getAdminProductDetailPage, getClientProductDetailPage, getClientProductsPage, postAdminCreateProduct, postAdminUpdateProductPage, postDeleteProduct } from "controllers/client/product.controller";
import { getLoginPage, getRegisterPage, getSuccessRedirectPage, postLogOut, postRegister } from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin } from "middleware/auth";
import { getCartPage, postCheckout, getThanksPage, postAddProductToCart, postAddProductToCartFromDetail, postDeleteCartItem, postPlaceOrder } from "controllers/client/cart.controller";
import { getOrderHistoryPage } from "controllers/client/order.controller";

const router = express.Router()

const webRoutes = (app: Express) => {
    //client routes
    router.get('/', getHomePage)
    router.get("/product/:id", getClientProductDetailPage)
    router.get("/success-redirect", getSuccessRedirectPage)
    router.get("/register", getRegisterPage)
    router.get("/login", getLoginPage)
    router.post("/register", postRegister)
    router.post("/login", passport.authenticate('local', {
        successRedirect: '/success-redirect',
        failureRedirect: '/login',
        failureMessage: true
    }))
    router.get("/cart", getCartPage)
    router.post("/add-product-to-cart/:id", postAddProductToCart)
    router.post("/delete-product-from-cart/:id", postDeleteCartItem)
    router.post("/checkout", postCheckout)
    router.post("/place-order", postPlaceOrder)
    router.get("/thanks", getThanksPage)
    router.get("/order-history", getOrderHistoryPage)
    router.post("/add-to-cart-from-detail/:id", postAddProductToCartFromDetail)
    router.get("/products", getClientProductsPage)



    //admin routes
    //Products
    router.get("/admin", getDashBoard)
    router.get("/admin/product", getAdminProductPage)
    router.get("/admin/create-product", getAdminCreateProductPage)
    router.post("/admin/create-product", fileUploadMiddleware("image", "images/product"), postAdminCreateProduct)
    router.post("/admin/delete-product/:id", postDeleteProduct)
    router.get("/admin/view-product-detail/:id", getAdminProductDetailPage)
    router.post("/admin/update-product", fileUploadMiddleware("image", "images/product"), postAdminUpdateProductPage)


    router.get("/admin/order", getAdminOrderPage)
    router.get("/admin/order-detail/:id", getAdminOrderDetailPage)
    router.get("/admin/user", getAdminUserPage)
    router.get("/admin/create-user", getAdminCreateUserPage)
    router.get("/admin/view-user-detail/:id", getUserDetail)
    router.post("/admin/delete-user/:id", postDeleteUser)
    router.post("/admin/create-user", fileUploadMiddleware('avatar'), postCreateUser)
    router.post("/admin/update-user", fileUploadMiddleware("avatar"), postUpdateUser)



    app.use("/", isAdmin, router)

}

export default webRoutes

