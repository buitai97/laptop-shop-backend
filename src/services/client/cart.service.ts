import { User } from "@prisma/client"
import { prisma } from "src/config/client"

const getCartById = (id: number) => {
    const cart = prisma.cart.findUnique({
        where: {
            userId: id
        },
        include: {
            cartDetails: {
                include: {
                    product: true
                }
            }
        }
    })

    return cart
}

const findCartDetailById = async (id: string) => {
    const cartDetail = await prisma.cartProduct.findUnique({
        where: {
            id: +id
        }
    })
    return cartDetail
}

const deleteCartProduct = async (userId: number, productId: string, sumCart: number) => {
    const cartDetail = await findCartDetailById(productId)
    if (cartDetail?.quantity > 1) {
        await prisma.cartProduct.update({
            where: {
                id: +productId
            }, data: {
                quantity: { decrement: 1 }
            }
        })
    }
    else if (cartDetail?.quantity === 1) {
        await prisma.cartProduct.delete({
            where: {
                id: +productId
            }
        })

    }
    if (sumCart > 0) {
        await prisma.cart.update({
            where: {
                userId: userId
            },
            data: {
                sum: { decrement: 1 }
            }
        })
    }
}

const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    })

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (cart) {
        // update current cart
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: {
                sum: { increment: quantity },
            }
        })

        const curCartProduct = await prisma.cartProduct.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })

        await prisma.cartProduct.upsert({
            where: {
                id: curCartProduct?.id ?? 0
            },
            update: {
                quantity: { increment: quantity }
            },
            create: {
                quantity: quantity,
                price: product.price,
                productId: productId,
                cartId: cart.id
            }
        })
    } else {
        // Create new cart
        await prisma.cart.create({
            data: {
                sum: quantity,
                userId: user.id,
                cartDetails: {
                    create: [
                        {
                            price: product.price,
                            quantity: 1,
                            productId: productId
                        }
                    ]
                }
            }
        })
    }
}

export { getCartById, findCartDetailById, deleteCartProduct, addProductToCart }