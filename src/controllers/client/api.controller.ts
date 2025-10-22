import { Request, Response } from "express";
import { handleGetAllUsers, handleGetUserByID, handleRegisterUser, handleUserLogin } from "services/client/api.service";
import { RegisterSchema, TRegisterSchema } from "validation/register.schema";

const getUsersAPI = async (req: Request, res: Response) => {
    const [users, count] = await handleGetAllUsers()
    return res.status(200).json({ users, count })
}

const getUserByID = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await handleGetUserByID(id)
    res.status(200).json({
        data: user
    })
}

const loginAPI = async (req: Request, res: Response) => {

    console.log("call")
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

const registerAPI = async (req: Request, res: Response) => {

    const parsed = await RegisterSchema.safeParseAsync(req.body)
    if (!parsed.success) {
        const errors = parsed.error.issues.map(i => `${i.message} (${String(i.path[0])})`);
        return res.status(400).json({ errors });
    }

    const { name, username, email, password } = req.body as TRegisterSchema
    try {
        await handleRegisterUser(name, email, password, username)
        return res.status(201).json({ message: "Register successfully!" })
    }
    catch (error) {
        return res.status(409).json({ error: (error as Error).message })
    }
}

const fetchAccountAPI = async (req: Request, res: Response) => {
    const user = req.user
    res.status(200).json({
        data: { user }
    })
}


export { getUsersAPI, getUserByID, loginAPI, fetchAccountAPI, registerAPI } 