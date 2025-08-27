import { prisma } from "src/config/client"



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

export { getOrdersByUserId }