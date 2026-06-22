import { z } from "zod";
import { USER_PROFILE_IMG_FILE_KEY, maxUsernamePasswordLength, minUsernamePasswordLength, usernamePasswordRegex } from "../constants";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { AuthUserInfoSchema } from "./IAuthUserInfo";


export const usernamePasswordSchema = z.string()
    .min(minUsernamePasswordLength, { message: `Must be at least ${minUsernamePasswordLength} characters long.` })
    .max(maxUsernamePasswordLength, { message: `Must be at most ${maxUsernamePasswordLength} characters long.` })
    .regex(usernamePasswordRegex, { message: "This contains certain invalid characters." });


export type IUsernamePassword = z.infer<typeof usernamePasswordSchema>;


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