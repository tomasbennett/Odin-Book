import z from "zod";




export const SuccessUploadLikeCommentSchema = z.object({
    commentId: z.string(),
});



export type ISuccessUploadLikeComment = z.infer<typeof SuccessUploadLikeCommentSchema>;