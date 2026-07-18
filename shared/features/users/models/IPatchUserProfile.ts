import z from "zod";
import { PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY, PATCH_USER_PROFILE_IMG_KEY } from "../constants";




export const PatchUserProfileSchema = z.object({
    aboutMe: z.string().optional(),
    [PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY]: z.string().optional(),
    [PATCH_USER_PROFILE_IMG_KEY]: z.string().optional()
});




export type IPatchUserProfile = z.infer<typeof PatchUserProfileSchema>;