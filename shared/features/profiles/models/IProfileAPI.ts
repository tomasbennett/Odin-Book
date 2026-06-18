import z from "zod";
import { ProfileHeaderSchema } from "./IProfileHeader";
import { ProfileRepliesSchema } from "./IProfileReplies";
import { ProfileCommentsSchema } from "./IProfileComments";
import { ProfilePostsSchema } from "./IProfilePosts";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";




export const ProfileSchema = z.object({
    headerInfo: ProfileHeaderSchema,
    replies: ProfileRepliesSchema,
    comments: ProfileCommentsSchema,
    posts: ProfilePostsSchema
});


export type IProfile = z.infer<typeof ProfileSchema>;






export const ProfileAPISuccessSchema = ProfileSchema.merge(APISuccessSchema);



export type IProfileAPISuccess = z.infer<typeof ProfileAPISuccessSchema>;