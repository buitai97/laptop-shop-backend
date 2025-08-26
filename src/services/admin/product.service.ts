import { prisma } from "src/config/client"

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

const getProducts = async () => {
    const products = await prisma.product.findMany()
    return products
}

const deleteProduct = async (id: number) => {
    await prisma.product.delete({
        where: { id: id }
    })
}

const getOrders = async () => {
    const orders = await prisma.order.findMany({ include: { user: true } })
    return orders
}

const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({ where: { id: +id }, include: { orderDetails: { include: { product: true } } } })
    console.log(order)
    return order
}



export { createProduct, getProducts, deleteProduct, updateProduct, getOrders, getOrderById }