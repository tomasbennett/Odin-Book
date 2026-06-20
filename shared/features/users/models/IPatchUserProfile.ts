import z from "zod";




export const PatchUserProfileSchema = z.object({
    aboutMe: z.string().optional(),
    accountBackgroundImgUrl: z.string().optional(),
    userProfileImgUrl: z.string().optional()
});




export type IPatchUserProfile = z.infer<typeof PatchUserProfileSchema>;