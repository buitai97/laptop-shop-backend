import getConnection from "config/db";
import { prisma } from 'config/client'
import { ACCOUNT_TYPE } from "src/config/constant";
import bcrypt from 'bcrypt'

const saltRounds = 10;

const hashPassword = async (plainText: string) => {
    return await bcrypt.hash(plainText, saltRounds)
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

const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
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

const handleGetUserDetail = async (id: string) => {
    const connection = await getConnection()

    try {
        const query = 'SELECT * FROM `users` WHERE id=?'
        const [results, fields] = await connection.execute(query, id)
        return results[0];
    }
    catch (err) {
        console.log(err)
        return []
    }
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
    handleCreateUser, handleGetRoleDetail, getAllUsers, handleUpdateUser,
    handleDeleteUser, handleGetUserDetail, hashPassword, handleGetRoles
}