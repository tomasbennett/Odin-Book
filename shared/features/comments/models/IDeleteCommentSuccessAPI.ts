import z from "zod";




export const DeleteCommentSuccessAPISchema = z.object({
    commentId: z.string(),
});


export type IDeleteCommentSuccessAPI = z.infer<typeof DeleteCommentSuccessAPISchema>;