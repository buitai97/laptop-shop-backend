import { Request, Response } from "express"
import { addProductToCart, deleteCartItem, getCartById, handlePlaceOrder, updateCartDetailBeforeCheckout } from "src/services/client/cart.service"

const getCartPage = async (req: Request, res: Response) => {
    const user = req.user
    if (user) {
        const cart = await getCartById(user.id)
        const cartDetails = cart?.cartDetails ?? []
        let total: number = 0
        cartDetails.forEach((cartDetails) => {
            total += cartDetails.price * cartDetails.quantity
        })
        return res.render("client/cart/cart.ejs", { cartDetails, total })
    }
    else {
        return res.redirect("/login")
    }
}

const postCheckout = async (req: Request, res: Response) => {
    const user = req.user
    const currentCartDetails: { id: string; quantity: string }[] = req.body?.cartDetails ?? []
    await updateCartDetailBeforeCheckout(currentCartDetails)
    if (user) {
        const cart = await getCartById(user.id)
        const cartDetails = cart?.cartDetails ?? []
        let total: number = 0
        cartDetails.forEach((cartDetails) => {
            total += cartDetails.price * cartDetails.quantity
        })
        return res.render("client/cart/checkout.ejs", { cartDetails, total })
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
const postAddProductToCartFromDetail = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user
    const { quantity } = req.body
    if (user) {
        await addProductToCart(Number(quantity), +id, user)
    }
    else {
        return res.redirect("/login")
    }

    return res.redirect(`/product/${id}`)
}

const postDeleteCartItem = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user

    await deleteCartItem(user.id, id, +user.sumCart)
    return res.redirect("/cart")
}

const postPlaceOrder = async (req: Request, res: Response) => {
    const user = req.user
    const { total, receiverName, receiverAddress, receiverPhone } = req.body
    if (!user) return res.redirect("login")
    await handlePlaceOrder(user.id, total, receiverName, receiverAddress, receiverPhone)

    return res.redirect("/thanks")
}

const getThanksPage = async (req: Request, res: Response) => {
    return res.render("client/cart/thanks.ejs")
}


export { getCartPage, postAddProductToCart, postAddProductToCartFromDetail, postDeleteCartItem, postCheckout, getThanksPage, postPlaceOrder }