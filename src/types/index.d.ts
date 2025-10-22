import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                name: string;
                address: string;
                email: string;
                phone: string;
                accountType: string;
                avatar: string;
                roleId: number;
                role: Role;
            };
        }
    }
}
