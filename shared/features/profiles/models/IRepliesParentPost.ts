import z from "zod";
import { PostContentSchema } from "../../posts/models/IPostContent";

export const ProfileRepliesParentPostSchema = z.object({
    parentPostId: z.string(),
    parentPostUserId: z.string(),
    parentPostUsername: z.string(),
    parentPostUserImgUrl: z.string().optional(),
    parentPostTitle: z.string().optional()
}).merge(PostContentSchema)


export type IProfileRepliesParentPost = z.infer<typeof ProfileRepliesParentPostSchema>;
