import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { prisma } from "../config/client";
import { getUserCartSum } from "../services/client/auth.service";
import { comparePassword, getUserByIdWithRole } from "../services/user.service";


const configPassportLocal = () => {
    passport.use(new LocalStrategy({ passReqToCallback: true }, async function verify(req, username, password, callback) {
        const { session } = req as any
        if (session?.messages?.length) {
            session.messages = []
        }
        const user = await prisma.user.findUnique({ where: { username: username } })
        if (!user) {
            return callback(null, false, { message: `Username or password is not valid.` });
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return callback(null, false, { message: `Username or password is not valid.` });
        }
        return callback(null, user as any)
    }));

    passport.serializeUser(async (user: any, cb) => {
        cb(null, { id: user.id, username: user.username })
    });

    passport.deserializeUser(async (user: any, cb) => {
        const userInDB = await getUserByIdWithRole(user.id) as any
        const sumCart = await getUserCartSum(user.id)

        return cb(null, { ...userInDB, sumCart });
    });
}

export default configPassportLocal