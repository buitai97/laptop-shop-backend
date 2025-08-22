import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { prisma } from "src/config/client";
import { comparePassword } from "src/services/user.service";
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

    passport.serializeUser(function (user: any, cb) {
        process.nextTick(function () {
            return cb(null, {
                id: user.id,
                username: user.username,
            });
        });
    });

    passport.deserializeUser(function (user, cb) {
        process.nextTick(function () {
            return cb(null, user);
        });
    });
}

export default configPassportLocal