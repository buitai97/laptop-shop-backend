import { prisma } from "src/config/client"
import { hashPassword } from "../user.service"
import { ACCOUNT_TYPE } from "src/config/constant"

const isEmailExist = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { username: email }
    })
    if (user) { return true }
    return false
}


const registerNewUser = async (name: string, username: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password)
    await prisma.user.create({ data: { accountType: ACCOUNT_TYPE.SYSTEM, email, name, username, password: hashedPassword, roleId: 1 } })

}

export { isEmailExist, registerNewUser }