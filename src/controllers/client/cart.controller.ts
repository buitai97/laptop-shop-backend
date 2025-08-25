import { Request, Response } from "express"
import { addProductToCart, deleteCartProduct, getCartById } from "src/services/client/cart.service"

const getCartPage = async (req: Request, res: Response) => {
    const user = req.user
    if (user) {
        const cart = await getCartById(user.id)
        const cartDetails = cart?.cartDetails ?? []
        let total: number = 0
        cartDetails.forEach((cartDetails) => {
            total += cartDetails.price * cartDetails.quantity
        })
        return res.render("client/cart/show.ejs", { cartDetails, total })
    }
    else {
        return res.redirect("/login")
    }
}

const postAddProductToCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user
    if (user) {
        await addProductToCart(1, +id, user)
    }
    else {
        return res.redirect("/login")
    }

    return res.redirect("/")
}

const postDeleteProductFromCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user

    await deleteCartProduct(user.id, id, +user.sumCart)
    return res.redirect("/cart")
}


export { getCartPage, postAddProductToCart, postDeleteProductFromCart }