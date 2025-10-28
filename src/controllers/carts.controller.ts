import { addToCart, getCartById, getUserCartSum, updateCart } from "../services/carts.service"
import { Request, Response } from "express"


const getCartAPI = async (req: Request, res: Response) => {
    const cart = await getCartById(+req.user!.id)
    console.log(cart)
    return res.status(200).json(cart?.cartItems ?? [])
}

const getUserCartSumAPI = async (req: Request, res: Response) => {
    const sum = await getUserCartSum(req.user!.id.toString())
    return res.status(200).json({ sum })
}

const addToCartAPI = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body
    const cart = await addToCart(+req.user!.id, +productId, +quantity)
    return res.status(200).json(cart)
}

const updateCartAPI = async (req: Request, res: Response) => {
    const { cartItemId, quantity } = req.body;
    console.log(quantity)
    await updateCart(+cartItemId, +quantity);

    return res.status(200).json({ message: `Cart with id ${cartItemId} updated successfully` });
}


export { getCartAPI, getUserCartSumAPI, addToCartAPI, updateCartAPI }