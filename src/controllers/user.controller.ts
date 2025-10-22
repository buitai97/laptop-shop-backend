import { Request, Response } from "express"
import { getUserById, handleCreateUser, handleDeleteUser, handleGetRoles, handleUpdateUser } from "../services/user.service";
import { getProducts } from "../services/client/product.service";


const getHomePage = async (req: Request, res: Response) => {
    const { page } = req.query
    let currentPage = page ? +page : 1
    if (currentPage < 1) currentPage = 1

    const { products, totalPages } = await getProducts(currentPage, 6)

    return res.render('client/home/show.ejs', { products, totalPages: +totalPages, page: currentPage })
}

const getCreateUserPage = async (req: Request, res: Response) => {
    return res.render("create-user.ejs");
}

const postCreateUser = async (req: Request, res: Response) => {
    const { name, email, address, phone, role } = req.body;
    const file = req.file
    const avatar = file?.filename ?? ""
    await handleCreateUser(name, email, address, phone, role, avatar);
    return res.redirect("/admin/user")
}

const postDeleteUser = async (req: Request, res: Response) => {
    await handleDeleteUser(req.params.id);
    return res.redirect("/admin/user")
}

const postUpdateUser = async (req: Request, res: Response) => {
    const { id, name, address, phone, role, avatar } = req.body;
    await handleUpdateUser(id, name, address, phone, role, avatar);
    return res.redirect("/admin/user")
}

const getUserDetail = async (req: Request, res: Response) => {
    const user = await getUserById(req.params.id);
    const roles = await handleGetRoles()
    return res.render("admin/user/detail.ejs", {
        user: user,
        roles: roles
    });
}

export { getHomePage, getCreateUserPage, postCreateUser, postDeleteUser, getUserDetail, postUpdateUser }