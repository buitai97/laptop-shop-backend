import { prisma } from "src/config/client"
import { TOTAL_ITEMS_PER_PAGE } from "src/config/constant"

const createProduct = async (
    detailDesc: string,
    factory: string,
    name: string,
    price: number,
    quantity: number,
    shortDesc: string,
    target: string,
    image: string
) => {

    await prisma.product.create({
        data: {
            detailDesc,
            factory,
            name,
            price,
            quantity,
            shortDesc,
            target,
            image
        }
    })

}

const updateProduct = async (
    id: number,
    detailDesc: string,
    factory: string,
    name: string,
    price: number,
    quantity: number,
    shortDesc: string,
    target: string,
    image: string) => {
    await prisma.product.update({
        where: { id: id },
        data: {
            detailDesc,
            factory,
            name,
            price,
            quantity,
            shortDesc,
            target,
            image
        }
    })
}

const getProducts = async (page: number) => {
    const skip = (page - 1) * TOTAL_ITEMS_PER_PAGE
    const products = await prisma.product.findMany({
        skip,
        take: TOTAL_ITEMS_PER_PAGE
    })
    return products
}

const countTotalProductPages = async () => {
    const totalProducts = await prisma.product.count()
    const totalPages = Math.ceil(totalProducts / TOTAL_ITEMS_PER_PAGE)
    return totalPages
}

const deleteProduct = async (id: number) => {
    await prisma.product.delete({
        where: { id: id }
    })
}

const getOrders = async (page: number) => {
    const skip = (page - 1) * TOTAL_ITEMS_PER_PAGE
    const orders = await prisma.order.findMany({ include: { user: true }, take: TOTAL_ITEMS_PER_PAGE, skip })
    return orders
}

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({ where: { id: +id }, include: { orderDetails: { include: { product: true } } } })
    console.log(order)
    return order
}



export { createProduct, getProducts, deleteProduct, updateProduct, getOrders, getOrderById, countTotalProductPages }