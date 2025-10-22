import { prisma } from "../../config/client"
import { TOTAL_ITEMS_PER_PAGE } from "../../config/constant"



const getOrdersByUserId = async (userId: number) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        }
    })

    return orders
}

const countTotalOrderPages = async () => {
    const totalOrders = await prisma.order.count()
    const totalPages = Math.ceil(totalOrders / TOTAL_ITEMS_PER_PAGE)

    return totalPages
}

export { getOrdersByUserId, countTotalOrderPages }