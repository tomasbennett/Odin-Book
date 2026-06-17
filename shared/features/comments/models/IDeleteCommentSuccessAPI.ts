import z from "zod";
import { CommentSchema } from "./IComment";




export const DeleteCommentSuccessAPISchema = z.object({
    commentId: z.string(),
    parentCommentId: z.string().optional(),
    postId: z.string()
});


export type IDeleteCommentSuccessAPI = z.infer<typeof DeleteCommentSuccessAPISchema>;