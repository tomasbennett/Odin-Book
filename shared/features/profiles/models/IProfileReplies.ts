import z from "zod";
import { PostContentSchema } from "../../posts/models/IPostContent";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { PostSchema } from "../../posts/models/IPost";



export const ProfileRepliesParentPostSchema = z.object({
    parentPostId: z.string(),
    parentPostUserId: z.string(),
    parentPostUsername: z.string(),
    parentPostUserImgUrl: z.string().optional(),
    parentPostTitle: z.string().optional()
}).merge(PostContentSchema)


export type IProfileRepliesParentPost = z.infer<typeof ProfileRepliesParentPostSchema>;


//CAN WE SPECIFY THAT IT IS JUST A POST WITH A PARENTID RIGHT NOW BECAUSE WE CAN SHOW A REPLY WITHOUT ITS PARENT NECESSARILY


export const ProfileRepliesSchema = z.array(
    PostSchema.merge(ProfileRepliesParentPostSchema)
);


export type IProfileReplies = z.infer<typeof ProfileRepliesSchema>;




export const ProfileRepliesAPISchema = APISuccessSchema.extend({
    replies: ProfileRepliesSchema
});


export type IProfileRepliesAPI = z.infer<typeof ProfileRepliesAPISchema>;