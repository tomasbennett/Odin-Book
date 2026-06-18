import z from "zod";


export const SuccessUploadLikePostSchema = z.object({
    postId: z.string()
});




export type ISuccessUploadLikePost = z.infer<typeof SuccessUploadLikePostSchema>;