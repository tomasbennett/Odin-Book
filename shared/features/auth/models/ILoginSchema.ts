import { z } from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { AuthUserInfoSchema } from "./IAuthUserInfo";
import { usernamePasswordSchema } from "./IUsernamePassword";





export const loginFormSchema = z.object({
    username: usernamePasswordSchema,
    password: usernamePasswordSchema
});

export type ILoginForm = z.infer<typeof loginFormSchema>;



export const SignInErrorSchema = z.object({
    message: z.string(),
    inputType: z.enum(["username", "password", "root"])
});

export type ISignInError = z.infer<typeof SignInErrorSchema>;





export const SuccessResSignInSchema = APISuccessSchema.merge(AuthUserInfoSchema).extend({
    accessToken: z.string()
});


export type ISuccessResSignIn = z.infer<typeof SuccessResSignInSchema>;