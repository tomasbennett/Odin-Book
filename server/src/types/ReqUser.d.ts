import type { Prisma, User as PrismaUser } from "@prisma/client";
import * as express from "express";
import { IAuthUserInfo } from "../../../shared/features/auth/models/IAuthUserInfo";


// export type IAuthUser = Prisma.UserGetPayload<{
//     include: {
//         profileImg: {
//             select: {
//                 supabaseFileId: true
//             }
//         }
//     }
// }>;


declare global {
    namespace Express {
        interface User extends IAuthUserInfo {}
    }
}
