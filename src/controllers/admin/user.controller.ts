import { Request, Response } from "express"
import {  handleDeleteUser } from "../../services/admin/user.service";

const postDeleteUser = async (req: Request, res: Response) => {
    await handleDeleteUser(req.params.id);
    return res.json({ message: "User deleted successfully" });
}




export {  postDeleteUser }