import { prisma } from "../../config/client"
import { comparePassword, hashPassword } from "../user.service"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { ACCOUNT_TYPE } from "../../config/constant"

const handleGetAllUsers = async () => {
    const users = await prisma.user.findMany({ omit: { password: true } })
    const count = await prisma.user.count()

    return [users, count]

}

const handleGetUserByID = async (id: string) => {
    return await prisma.user.findUnique({ where: { id: +id } })
}

const handleRegisterUser = async (name: string, username: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password)
    await prisma.user.create({ data: { accountType: ACCOUNT_TYPE.SYSTEM, email, name, username, password: hashedPassword, roleId: 1 } })

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
    const payload = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        accountType: user.accountType,
        avatar: user.avatar,
        role: user.role,
        name: user.name
    }

    const secret = process.env.JWT_SECRET
    const access_token = jwt.sign(payload, secret!, {
        expiresIn: process.env.JWT_EXPIRE as any
    })


    return access_token
}
export {
    handleGetAllUsers,
    handleGetUserByID,
    handleUserLogin,
    handleRegisterUser
}