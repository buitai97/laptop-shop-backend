import { Request, Response } from "express"
import { TOTAL_ITEMS_PER_PAGE } from "src/config/constant"
import { getDashboardInfo } from "src/services/admin/dashboard.service"
import { countTotalProductPages, getOrderById, getOrders, getProducts } from "src/services/admin/product.service"
import { countTotalOrderPages } from "src/services/client/order.service"
import { getRoles } from "src/services/role.service"
import { countTotalUserPages, getUsers } from "src/services/user.service"
const getDashBoard = async (req: Request, res: Response) => {
    const { userCount, orderCount, productCount } = await getDashboardInfo()

    return res.render('admin/dashboard/show.ejs', { userCount, orderCount, productCount })
}

const getAdminUserPage = async (req: Request, res: Response) => {
    const { page } = req.query
    const totalPages = await countTotalUserPages()
    let currentPage = page ? +page : 1
    if (currentPage <= 0) currentPage = 1
    if (currentPage > totalPages) currentPage = totalPages
    const users = await getUsers(currentPage)
    return res.render('admin/user/show.ejs', {
        users,
        totalPages,
        currentPage
    })
}

const getAdminOrderPage = async (req: Request, res: Response) => {
    const { page } = req.query
    const totalPages = await countTotalOrderPages()
    let currentPage = page ? +page : 1
    if (currentPage < 1) currentPage = 1
    if (currentPage > totalPages) currentPage = totalPages
    const orders = await getOrders(currentPage)
    return res.render('admin/order/show.ejs', { orders, currentPage, totalPages })
}

const getAdminProductPage = async (req: Request, res: Response) => {
    const { page } = req.query

    const totalPages = await countTotalProductPages()
    let currentPage = page ? +page : 1
    if (currentPage < 1) currentPage = 1
    if (currentPage > totalPages) currentPage = totalPages
    const products = await getProducts(currentPage)
    return res.render('admin/product/show.ejs', { products, totalPages, currentPage })
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