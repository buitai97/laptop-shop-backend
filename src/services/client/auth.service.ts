import { prisma } from "../../config/client"
import { hashPassword } from "../user.service"
import { ACCOUNT_TYPE } from "../../config/constant"

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


const registerNewUser = async (name: string, username: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password)
    await prisma.user.create({ data: { accountType: ACCOUNT_TYPE.SYSTEM, email, name, username, password: hashedPassword, roleId: 1 } })

}
export { isEmailExist, registerNewUser, getUserCartSum }