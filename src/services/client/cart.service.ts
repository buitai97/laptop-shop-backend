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
    const cartDetail = await prisma.cartDetail.findUnique({
        where: {
            id: +id
        }
    })
    return cartDetail
}

const deletecartDetail = async (userId: number, productId: string, sumCart: number) => {
    const cartDetail = await findCartDetailById(productId)
    if (cartDetail?.quantity > 1) {
        await prisma.cartDetail.update({
            where: {
                id: +productId
            }, data: {
                quantity: { decrement: 1 }
            }
        })
    }
    else if (cartDetail?.quantity === 1) {
        await prisma.cartDetail.delete({
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

        const curcartDetail = await prisma.cartDetail.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })

        await prisma.cartDetail.upsert({
            where: {
                id: curcartDetail?.id ?? 0
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

const updateCartDetailBeforeCheckout = async (data: { id: string; quantity: string }[]) => {
    for (let i = 0; i < data.length; i++) {
        await prisma.cartDetail.update({
            where: {
                id: +data[i].id
            },
            data: {
                quantity: +data[i].quantity
            }
        })
    }
}

const handlePlaceOrder = async (userId: number, total: number, receiverName: string, receiverAddress: string, receiverPhone: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { cartDetails: true }
    })

    const dataOrderDetails = cart?.cartDetails.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId
    })) ?? []
    if (cart) {
        //create order
        await prisma.order.create({
            data: {
                paymentMethod: "COD",
                paymentStatus: "UNPAID",
                status: "PENDING",
                totalPrice: +total,
                userId,
                receiverName,
                receiverAddress,
                receiverPhone,
                orderDetails: {
                    create: dataOrderDetails
                }
            }
        })

        // remove cart

        await prisma.cartDetail.deleteMany({
            where: { cartId: cart.id },
        })

        await prisma.cart.delete({
            where: { id: cart.id },
        })

    }
}

export { getCartById, findCartDetailById, deletecartDetail, handlePlaceOrder, addProductToCart, updateCartDetailBeforeCheckout }