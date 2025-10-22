import { Request, Response } from "express"
import { getOrdersByUserId } from "services/client/order.service"

const getOrderHistoryPage = async (req: Request, res: Response) => {
    const userId = req.user.id
    const orders = await getOrdersByUserId(userId)
    res.render("client/order/order-history.ejs", { orders })
}


export { getOrderHistoryPage }