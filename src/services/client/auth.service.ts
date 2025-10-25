import "dotenv/config"
import jwt from "jsonwebtoken"
import { prisma } from "../../config/client"
import { ACCOUNT_TYPE } from "../../config/constant"
import { comparePassword, hashPassword } from "../admin/user.service"
import { JwtPayload } from "../../types/jwt"

const getRoles = () => {
    const roles = prisma.role.findMany()
    return roles
}


const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })
    if (user) { return true }
    return false
}

const getUserCartSum = async (id: string) => {
    const user = await prisma.cart.findUnique({
        where: {
            userId: +id
        },
    })
    return user?.sum ?? 0
}

const handleRegisterUser = async (name: string, username: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password)
    return await prisma.user.create({ data: { accountType: ACCOUNT_TYPE.SYSTEM, email, name, username, password: hashedPassword, roleId: 1 } })
}

const handleUserLogin = async (username: string, password: string) => {

    const user = await prisma.user.findUnique({ where: { username: username }, include: { role: true } })
    if (!user) {
        throw new Error(`Username: ${username} not found`)
    }
    const isMatch = await comparePassword(password, user.password!)
    if (!isMatch) {
        throw new Error(`Invalid password`)
    }
    const payload: JwtPayload = {
        id: user.id,
        username: user.username ? user.username : '',
        avatar: user.avatar ? user.avatar : '',
        role: { id: user.role.id, name: user.role.name, description: user.role.description },
        name: user.name ? user.name : ''
    }

    const secret = process.env.JWT_SECRET
    const access_token = jwt.sign(payload, secret!, {
        expiresIn: process.env.JWT_EXPIRE as any
    })
    return access_token
}
export { getRoles, isEmailExist, getUserCartSum, handleRegisterUser, handleUserLogin }