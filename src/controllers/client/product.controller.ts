import { Request, Response } from "express"
import { createProduct, deleteProduct, updateProduct } from "../../services/admin/product.service"
import { getProductById, getProducts } from "../../services/client/product.service";
import { ProductSchema, TProductSchema } from "../../validation/product.schema"

const factoryOptions = [
    { name: "Apple (MacBook)", value: "APPLE" },
    { name: "Asus", value: "ASUS" },
    { name: "Lenovo", value: "LENOVO" },
    { name: "Dell", value: "DELL" },
    { name: "LG", value: "LG" },
    { name: "Acer", value: "ACER" },
];
const targetOptions = [
    { name: "Compact", value: "Compact" },
    { name: "Graphic", value: "GRAPHIC" },
    { name: "OFFICE", value: "OFFICE" },
    { name: "GAMING", value: "GAMING" },
];


const getClientProductsPage = async (req: Request, res: Response) => {
    const { page, brands, target, price = "", sort = "" } = req.query as {
        page?: string,
        brands: string[],
        target: string[],
        price: string,
        sort: string
    }
    let currentPage = page ? +page : 1
    if (currentPage <= 0) currentPage = 1
    const { products, totalPages } = await getProducts(currentPage, 8, brands, target, price, ["0", "3000"], "false", sort)

    return res.render("client/product/products.ejs", { products, totalPages: +totalPages, page: +currentPage })
}

const getClientProductDetailPage = async (req: Request, res: Response) => {
    const id = req.params.id
    const product = await getProductById(+id)
    res.render("client/product/detail.ejs", { product })
}

const getAdminCreateProductPage = (req: Request, res: Response) => {
    const errors = []
    const oldData = {
        detailDesc: "", factory: "", name: "", price: "", quantity: "", shortDesc: "", target: ""
    }
    res.render("admin/product/create-product.ejs", { errors, oldData, targetOptions, factoryOptions })
}

const postAdminCreateProduct = async (req: Request, res: Response) => {
    const { detailDesc, factory, name, price, quantity, shortDesc, target } = req.body as TProductSchema
    const validate = ProductSchema.safeParse(req.body)
    const oldData = {
        detailDesc, factory, name, price, quantity, shortDesc, target
    }

    if (validate.success) {
        const image = req?.file?.filename ?? null
        await createProduct(detailDesc, factory, name, +price, +quantity, shortDesc, target, image)
    }
    else {
        const errorZod = validate.error.issues
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`)
        return res.render("admin/product/create-product.ejs", { errors, oldData, targetOptions, factoryOptions })
    }
    return res.redirect("/admin/product")
}

const getAdminProductDetailPage = async (req: Request, res: Response) => {
    const product = await getProductById(+req.params.id)
    const errors = []
    res.render("admin/product/update-product.ejs", { errors, product, targetOptions, factoryOptions })
}

const postAdminUpdateProductPage = async (req: Request, res: Response) => {
    const { id, detailDesc, factory, name, price, quantity, shortDesc, target } = req.body
    const validate = ProductSchema.safeParse(req.body)

    if (validate.success) {
        const image = req?.file?.filename ?? null
        await updateProduct(+id, detailDesc, factory, name, +price, +quantity, shortDesc, target, image)
    }
    else {
        const errorZod = validate.error.issues
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`)
        return res.render("admin/product/update-product.ejs", { errors, targetOptions, factoryOptions })
    }
    return res.redirect("/admin/product")
}

const postDeleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id
    await deleteProduct(+id)
    return res.redirect("/admin/product")
}

const getProductsAPI = async (req: Request, res: Response) => {
    const { page, pageSize, brands, targets, price, priceRange, inStockOnly, sort } = req.query;
    const products = await getProducts(+page, +pageSize, brands as string[], targets as string[], price as string, priceRange as string[], inStockOnly as string, sort as string)
    return res.status(200).json(products)
}

const getProductAPI = async (req: Request, res: Response) => {
    const product = await getProductById(+req.params.id)
    return res.status(200).json(product)
}


export { getProductsAPI, getProductAPI, getClientProductDetailPage, getClientProductsPage, getAdminCreateProductPage, getAdminProductDetailPage, postAdminCreateProduct, postAdminUpdateProductPage, postDeleteProduct }