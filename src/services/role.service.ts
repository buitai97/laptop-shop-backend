import { prisma } from "config/client"

const getRoles = () => {
    const roles = prisma.role.findMany()
    return roles
}

export { getRoles }