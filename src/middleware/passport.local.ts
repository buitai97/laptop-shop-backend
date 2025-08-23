import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { prisma } from "src/config/client";
import { comparePassword, getUserById } from "src/services/user.service";


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
        return callback(null, user)
    }));

    passport.serializeUser(async (user: any, cb) => {
        cb(null, { id: user.id, username: user.username })
    });

    passport.deserializeUser(async (user: any, cb) => {
        const userInDB = await getUserById(user.id)
        return cb(null, { ...userInDB });
    });
}

export default configPassportLocal