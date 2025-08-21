import { Request, Response } from "express"
import { createProduct, deleteProduct, getProductById, updateProduct } from "src/services/admin/product.service"
import { ProductSchema, TProductSchema } from "src/validation/product.schema"

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


const getProductPage = async (req: Request, res: Response) => {
    const id = req.params.id
    const product = await getProductById(+id)

    console.log(product)
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

const getProductDetailPage = async (req: Request, res: Response) => {
    const product = await getProductById(+req.params.id)
    const errors = []
    res.render("admin/product/update-product.ejs", { errors, product, targetOptions, factoryOptions })
}

const postAdminUpdateProductPage = async (req: Request, res: Response) => {
    console.log(req.body)
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



export { getProductPage, getAdminCreateProductPage, getProductDetailPage, postAdminCreateProduct, postAdminUpdateProductPage, postDeleteProduct }