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
    try {
        await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
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
                await tx.order.create({
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

                await tx.cartDetail.deleteMany({
                    where: { cartId: cart.id },
                })

                await tx.cart.delete({
                    where: { id: cart.id },
                })

            }

            //check product
            for (let i = 0; i < cart.cartDetails.length; i++) {
                const productId = cart.cartDetails[i].productId
                const product = await tx.product.findUnique({
                    where: { id: productId }
                })

                if (!product || product.quantity < cart.cartDetails[i].quantity) {
                    throw new Error(`Only ${product.quantity} count is available for ${product.name}`)
                }
                await tx.product.update({
                    where: { id: productId },
                    data: {
                        quantity: { decrement: cart.cartDetails[i].quantity },
                        sold: { increment: cart.cartDetails[i].quantity }
                    }
                })
            }
        })
        return ""
    }
    catch (error) { return error.message }
}

export { getCartById, findCartDetailById, deleteCartItem, handlePlaceOrder, addProductToCart, updateCartDetailBeforeCheckout }