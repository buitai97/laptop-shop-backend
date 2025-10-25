import { prisma } from '../../config/client'
import bcrypt from 'bcrypt'

const saltRounds = 10;


const handleGetAllUsers = async () => {
    const users = await prisma.user.findMany({ omit: { password: true, phone: true, address: true, roleId: true, accountType: true }, include: { role: true } })
    const count = await prisma.user.count()
    return [users, count]

}
const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds)
}

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword)
}

const handleGetUserByID = async (id: string) => {
    return await prisma.user.findUnique({ where: { id: +id }, include: { role: { select: { name: true } } } })
}

const handleDeleteUser = async (id: string) => {
    const result = await prisma.user.delete({ where: { id: +id } })
    return result
}

const handleUpdateUser = async (
    id: number,
    name: string,
    address: string,
    phone: string,
    role: string,
    avatar: string) => {
    const updatedUser = await prisma.user.update({
        where: { id: +id },
        data: {
            name: name,
            address: address,
            phone: phone,
            roleId: +role,
            ...(avatar !== undefined && { avatar: avatar }),
        }
    })
    return updatedUser
}

const handleGetUserById = async (id: string) => {
    const user = prisma.user.findUnique({
        where: {
            id: +id
        }
    })
    return user
}


const handleGetRoleDetail = async (roleId: string) => {
    const result = await prisma.role.findUnique({
        where: {
            id: +roleId
        }
    })
    return result
}

const handleGetRoles = async () => {
    const result = await prisma.role.findMany()
    return result
}

export {
    handleGetRoleDetail, handleUpdateUser,
    handleDeleteUser, handleGetUserById, hashPassword, handleGetRoles,
    comparePassword, handleGetAllUsers, handleGetUserByID
}