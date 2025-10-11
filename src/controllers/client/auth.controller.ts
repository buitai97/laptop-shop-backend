import { NextFunction, Request, Response } from "express"
import { registerNewUser } from "src/services/client/auth.service"
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema"


const getRegisterPage = async (req: Request, res: Response) => {
    const errors = []
    return res.render("client/auth/register.ejs", { errors })
}

const getLoginPage = async (req: Request, res: Response) => {
    const session = req.session as any
    const messages = session?.messages ?? []
    return res.render("client/auth/login.ejs", { messages })
}

const postRegister = async (req: Request, res: Response) => {
    const { name, username, email, password } = req.body as TRegisterSchema
    const validate = await RegisterSchema.safeParseAsync(req.body)
    if (!validate.success) {
        const errorsZod = validate.error.issues
        const errors = errorsZod?.map((error) => `${error.message} (${error.path[0]})`)
        const oldData = {
            name, password, email
        }
        return res.render("client/auth/register.ejs", {
            errors, oldData
        })
    }
    await registerNewUser(name, email, password, username)
    return res.redirect("/login")
}

const postLogin = async (req: Request, res: Response) => {
    res.redirect("/")
}

const getSuccessRedirectPage = async (req: Request, res: Response) => {
    const user = req.user
    if (user.role.name === "ADMIN") {
        res.redirect("/admin")
        return
    }
    else {
        return res.redirect("/")
    }
}

const postLogOut = (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200)
    });
}

export { getRegisterPage, getLoginPage, postLogin, postRegister, getSuccessRedirectPage, postLogOut }