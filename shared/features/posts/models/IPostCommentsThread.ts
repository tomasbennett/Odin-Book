import z from "zod";
import { PostSchema } from "./IPost";
import { CommentSchema } from "../../comments/models/IComment";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";



export const PostCommentsThreadSchema = z.object({
    post: PostSchema,
    directChildComments: z.array(CommentSchema)
});


export type IPostCommentsThread = z.infer<typeof PostCommentsThreadSchema>;



export const PostCommentsThreadAPISchema = APISuccessSchema.merge(PostCommentsThreadSchema);

export type IPostCommentsThreadAPI = z.infer<typeof PostCommentsThreadAPISchema>;