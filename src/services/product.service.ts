import { prisma } from "../config/client"
import { TOTAL_ITEMS_PER_PAGE } from "../config/constant"

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
    return order
}

const getProducts = async (
    page?: number,
    pageSize?: number,
    brands?: string | string[],
    targets?: string | string[],
    price?: string,
    priceRange?: string[],
    inStockOnly?: string,
    sort?: string
) => {
    // ---- pagination: coerce + defaults ----
    const pageNum = Number.isFinite(page as number) && (page as number) > 0 ? Math.floor(page as number) : 1;
    const pageSizeNum = Number.isFinite(pageSize as number) && (pageSize as number) > 0 ? Math.floor(pageSize as number) : 20;
    const skip = (pageNum - 1) * pageSizeNum;
    const take = pageSizeNum;

    // ---- filters ----
    const whereClause: any = {};

    if (brands) {
        const brandsArray = Array.isArray(brands) ? brands : [brands];
        if (brandsArray.length) whereClause.factory = { in: brandsArray };
    }

    if (targets) {
        const targetArray = Array.isArray(targets) ? targets : [targets];
        if (targetArray.length) whereClause.target = { in: targetArray };
    }

    if (priceRange && priceRange.length === 2) {
        const [gt, lt] = priceRange;
        const gte = Number(gt);
        const lte = Number(lt);
        if (Number.isFinite(gte) || Number.isFinite(lte)) {
            whereClause.price = {
                ...(Number.isFinite(gte) ? { gte } : {}),
                ...(Number.isFinite(lte) ? { lte } : {}),
            };
        }
    }

    if (inStockOnly === "true") {
        whereClause.quantity = { gte: 1 };
    }

    if (price) {
        const priceInput = price.split(",");
        const priceCondition: any[] = [];

        for (const token of priceInput) {
            if (token === "under-1000") priceCondition.push({ price: { lt: 1000 } });
            if (token === "1000-1500") priceCondition.push({ price: { gte: 1000, lte: 1500 } });
            if (token === "1500-to-2000") priceCondition.push({ price: { gte: 1500, lt: 2000 } });
            if (token === "over-2000") priceCondition.push({ price: { gte: 2000 } });
        }

        if (priceCondition.length) {
            whereClause.OR = priceCondition;
        }
    }

    // ---- sort ----
    const orderBy =
        sort === "desc" ? { price: "desc" as const } :
            sort === "asc" ? { price: "asc" as const } :
                { id: "desc" as const };

    // ---- query ----
    const [products, count] = await prisma.$transaction([
        prisma.product.findMany({
            where: whereClause,
            orderBy,
            skip,
            take,
        }),
        prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.max(1, Math.ceil(count / pageSizeNum));

    return { products, totalPages, count };
};

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



export { createProduct, getProducts, deleteProduct, updateProduct, getOrders, getOrderById, getProductById, countTotalProductClientPages }