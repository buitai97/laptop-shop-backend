import { Request, Response } from "express";
import { handleGetAllUsers, handleGetUserByID, handleUserLogin } from "src/services/client/api.service";

const getUsersAPI = async (req: Request, res: Response) => {
    const users = await handleGetAllUsers()
    return res.status(200).json(users)
}

const getUserByID = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await handleGetUserByID(id)
    res.status(200).json({
        data: user
    })
}

const loginAPI = async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const accessToken = await handleUserLogin(username, password)
        res.status(200).json({
            accessToken
        })
    } catch (error) {
        res.status(401).json({
            data: null,
            message: error.message
        })
    }
}

const fetchAccountAPI = async (req: Request, res: Response) => {
    const user = req.user
    res.status(200).json({
        data: { user }
    })
}


export { getUsersAPI, getUserByID, loginAPI, fetchAccountAPI } 