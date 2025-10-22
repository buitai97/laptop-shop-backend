import { prisma } from '../config/client'
import { ACCOUNT_TYPE, TOTAL_ITEMS_PER_PAGE } from "../config/constant";
import bcrypt from 'bcrypt'

const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds)
}

const comparePassword = async (plainText: string, hashPassword: string) => {
    return await bcrypt.compare(plainText, hashPassword)
}
const handleCreateUser = async (
    name: string,
    email: string,
    address: string,
    phone: string,
    role: string,
    avatar: string) => {
    const defaultPassword = await hashPassword("123456")
    await prisma.user.create({
        data: {
            name: name,
            email: email,
            address: address,
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            avatar: avatar,
            phone: phone,
            roleId: +role,
        }
    })
}

const getUsers = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE
    const skip = (page - 1) * pageSize
    const users = await prisma.user.findMany({
        skip: skip,
        take: pageSize,
    })
    return users
}

const countTotalUserPages = async () => {
    const totalItems = await prisma.user.count()
    const totalPages = Math.ceil(totalItems / TOTAL_ITEMS_PER_PAGE)

    return totalPages
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

const getUserById = async (id: string) => {
    const user = prisma.user.findUnique({
        where: {
            id: +id
        }
    })
    return user
}

const getUserByIdWithRole = async (id: string) => {
    const userWithRole = await prisma.user.findUnique({
        where: {
            id: +id
        },
        include: {
            role: true
        },
        omit: {
            password: true
        }
    })
    return userWithRole
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
    handleCreateUser, handleGetRoleDetail, getUsers, handleUpdateUser,
    handleDeleteUser, getUserById, hashPassword, handleGetRoles,
    comparePassword, getUserByIdWithRole, countTotalUserPages
}