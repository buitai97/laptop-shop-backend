import { NextFunction, Request, Response } from "express"
const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        return res.redirect("/")
    }
}
const logOut = (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

export { isLoggedIn, logOut }
