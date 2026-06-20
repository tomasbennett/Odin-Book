import z from "zod";



export const UserSearchBarSchema = z.object({
    userId: z.string(),
    username: z.string(),
    userEmail: z.string().optional(),
    userProfileImgUrl: z.string().optional()
});



export type IUserSearchBar = z.infer<typeof UserSearchBarSchema>;