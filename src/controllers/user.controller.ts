import { Request, Response } from "express"
import { getUserById, handleCreateUser, handleDeleteUser, handleGetRoles, handleUpdateUser } from "services/user.service";
import { getProducts } from "src/services/client/product.service";


const getHomePage = async (req: Request, res: Response) => {
    const products = await getProducts()
    return res.render('client/home/show.ejs', { products })
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
    const { id, name, address, phone, role } = req.body;
    const avatar = req.file?.filename ?? undefined
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