import z from "zod";

import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { usernamePasswordSchema } from "./IUsernamePassword";


//BASE OBJECTS

export const AuthUserInfoSchema = z.object({
    userId: z.string(),
    username: usernamePasswordSchema,
    userProfileImgUrl: z.string().optional()
});


export type IAuthUserInfo = z.infer<typeof AuthUserInfoSchema>;





//API SUCCESS RESPONSES

export const SuccessResAuthUserInfoSchema = APISuccessSchema.merge(AuthUserInfoSchema);
export type ISuccessResAuthUserInfo = z.infer<typeof SuccessResAuthUserInfoSchema>;