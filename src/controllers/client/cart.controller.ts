import { NextFunction, Request, Response } from "express"

const getCartPage = (req: Request, res: Response) => {
    return res.render("client/cart/show.ejs")
}

export { getCartPage }