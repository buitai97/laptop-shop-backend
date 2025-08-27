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

const deleteCartItem = async (userId: number, cartDetailId: string, sumCart: number) => {
    console.log(cartDetailId)
    const cartDetail = await findCartDetailById(cartDetailId)

    await prisma.cartDetail.delete({
        where: {
            id: +cartDetailId
        }
    })

    if (sumCart > 0) {
        await prisma.cart.update({
            where: {
                userId: userId
            },
            data: {
                sum: { decrement: cartDetail.quantity }
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

        const curCartDetail = await prisma.cartDetail.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })

        await prisma.cartDetail.upsert({
            where: {
                id: curCartDetail?.id ?? 0
            },
            update: {
                quantity: { increment: +quantity }
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
                            quantity: quantity,
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

export { getCartById, findCartDetailById, deleteCartItem, handlePlaceOrder, addProductToCart, updateCartDetailBeforeCheckout }