import { prisma } from "src/config/client"

const getProducts = async (
    page: number,
    pageSize?: number,
    factory?: string,
    target?: string,
    price?: string,
    sort?: string
) => {

    let whereClause: any = {}
    if (factory) {
        const factoryInput = factory.split(",")
        whereClause.factory = { in: factoryInput }
    }


    if (target) {
        const targetInput = target.split(",")
        whereClause.target = { in: targetInput }
    }


    if (price) {
        const priceInput = price.split(',')
        const priceCondition = []
        for (let i = 0; i < priceInput.length; i++) {
            if (priceInput[i] === "under-1000") {
                priceCondition.push({ "price": { "lt": 1000 } })
            }
            if (priceInput[i] === "1000-1500") {
                priceCondition.push({
                    "price":
                        { "gte": 1000, "lte": 1500 }
                })
            } if (priceInput[i] === "1500-to-2000") {
                priceCondition.push({
                    "price": { "lt": 2000, "gte": 1500 }
                })
            } if (priceInput[i] === "over-2000") {
                priceCondition.push({
                    "price": { "gte": 2000 }
                })
            }
        }
        whereClause.OR = priceCondition

    }

    // build sort query
    let orderByClause: any = {}

    if (sort) {
        if (sort === "desc") {
            orderByClause.orderBy = {
                price: "desc"
            }
        }
        if (sort === "asc") {
            orderByClause.orderBy = {
                price: "asc"
            }
        }
    }

    const skip = (page - 1) * pageSize
    const [products, count] = await prisma.$transaction([
        prisma.product.findMany({
            skip: skip,
            take: pageSize,
            where: whereClause,
            ...orderByClause
        }),
        prisma.product.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(count / pageSize)

    return { products, totalPages, count }
}

const countTotalProductClientPages = async (pageSize: number) => {
    const totalItems = await prisma.product.count()
    const totalPages = Math.ceil(totalItems / pageSize)
    return totalPages
}

const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    })
    return product
}

export { getProducts, getProductById, countTotalProductClientPages }