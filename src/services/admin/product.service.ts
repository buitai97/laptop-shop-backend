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



export { createProduct, getProducts, deleteProduct, updateProduct }