import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { PostSchema } from "./IPost";


export const PostRepliesThreadSchema = z.object({
    post: PostSchema,
    replies: z.array(PostSchema),
    parentPosts: z.array(PostSchema)
});


export type IPostRepliesThread = z.infer<typeof PostRepliesThreadSchema>;



export const PostRepliesSuccessAPISchema = APISuccessSchema.merge(PostRepliesThreadSchema);



export type IPostRepliesSuccessAPI = z.infer<typeof PostRepliesSuccessAPISchema>;