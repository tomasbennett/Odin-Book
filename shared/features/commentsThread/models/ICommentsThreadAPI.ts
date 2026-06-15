import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { CommentSchema } from "../../comments/models/IComment";
import { PostSchema } from "../../posts/models/IPost";



export const CommentsThreadAPIResponseSchema = APISuccessSchema.extend({
    post: PostSchema,
    replies: z.array(CommentSchema),
    comment: CommentSchema,
    parentComments: z.array(CommentSchema)
});



export type ICommentsThreadAPIResponse = z.infer<typeof CommentsThreadAPIResponseSchema>;