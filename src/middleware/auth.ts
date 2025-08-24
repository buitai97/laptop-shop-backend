import { NextFunction, Request, Response } from "express"
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        return res.redirect("/")
    }
}

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/admin')) {
        const user = req.user

        if (user?.role?.name === "ADMIN") {
            next()
        }
        else res.render("status/403.ejs");

        return
    }

    next()
}

export { isLoggedIn,isAdmin }
