import z from "zod";
import { usernamePasswordSchema } from "./ILoginSchema";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";


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