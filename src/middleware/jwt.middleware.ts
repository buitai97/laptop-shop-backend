import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import 'dotenv/config'


const checkValidJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]
    const whiteList = [
        "/login"
    ]
    const isWhiteList = whiteList.some(route => route === req.path)
    if (isWhiteList) {
        next()
        return
    }
    try {
        const dataDecoded: any = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: dataDecoded.id,
            username: dataDecoded.username,
            password: "",
            name: "",
            address: "",
            email: "",
            phone: "",
            accountType: dataDecoded.accountType,
            avatar: dataDecoded.avatar,
            roleId: dataDecoded.roleId,
            role: dataDecoded.role
        }
        next()
    }
    catch (error) {
        res.status(404).json({
            data: null,
            message: error.message
        })
    }
}


export { checkValidJWT }