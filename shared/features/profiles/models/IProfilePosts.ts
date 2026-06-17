import z from "zod";
import { PostSchema } from "../../posts/models/IPost";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";




export const ProfilePostsSchema = z.array(PostSchema);



export type IProfilePosts = z.infer<typeof ProfilePostsSchema>;




export const ProfilePostsAPISuccessSchema = APISuccessSchema.extend({
    posts: ProfilePostsSchema
});


export type IProfilePostsAPISuccess = z.infer<typeof ProfilePostsAPISuccessSchema>;