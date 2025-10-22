import { Request, Response } from "express"
import { getProductById, getProducts } from "../../services/client/product.service";


const getProductsAPI = async (req: Request, res: Response) => {
    const { page, pageSize, brands, targets, price, priceRange, inStockOnly, sort } = req.query;
    const products = await getProducts(+page, +pageSize, brands as string[], targets as string[], price as string, priceRange as string[], inStockOnly as string, sort as string)
    return res.status(200).json(products)
}

const getProductByIdAPI = async (req: Request, res: Response) => {
    const product = await getProductById(+req.params.id)
    return res.status(200).json(product)
}


export { getProductsAPI, getProductByIdAPI }