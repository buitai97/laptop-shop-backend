import { Role, Cart, User as UserPrisma } from "@prisma/client";

type UserRole = User & Role & Cart

declare global {
    namespace Express {
        interface User extends UserPrisma {
            role?: Role,
            sumCart?: number
        }
    }
    
}