import { Request, Response } from "express"
import { getOrderById, getOrders, getProducts } from "src/services/admin/product.service"
import { getRoles } from "src/services/role.service"
import { getAllUsers } from "src/services/user.service"
const getDashBoard = async (req: Request, res: Response) => {
    return res.render('admin/dashboard/show.ejs')
}

const getAdminUserPage = async (req: Request, res: Response) => {
    const users = await getAllUsers()
    return res.render('admin/user/show.ejs', {
        users: users
    })
}

const getAdminOrderPage = async (req: Request, res: Response) => {
    const orders = await getOrders()
    return res.render('admin/order/show.ejs', { orders })
}

const getAdminProductPage = async (req: Request, res: Response) => {
    const products = await getProducts()
    return res.render('admin/product/show.ejs', { products })
}

const getAdminCreateUserPage = async (req: Request, res: Response) => {
    const roles = await getRoles()
    return res.render("admin/user/create-user.ejs", { roles: roles })
}

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await getOrderById(id)
    const orderDetails = order.orderDetails
    return res.render("admin/order/order-detail.ejs", { orderDetails })
}



export { getDashBoard, getAdminUserPage, getAdminProductPage, getAdminOrderPage, getAdminCreateUserPage, getAdminOrderDetailPage }