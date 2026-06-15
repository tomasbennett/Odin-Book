import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { CommentSchema } from "../../comments/models/IComment";


export const ProfileCommentsPostDetailsSchema = z.object({
    postUsername: z.string(),
    postTitle: z.string().optional(),
    postUserId: z.string(),
    postUserProfileImageUrl: z.string().optional()
});



export type IProfileCommentsPost = z.infer<typeof ProfileCommentsPostDetailsSchema>;



export const ProfileCommentsSchema = z.array(
    CommentSchema.merge(ProfileCommentsPostDetailsSchema)
);

export type IProfileComments = z.infer<typeof ProfileCommentsSchema>;









export const ProfileCommentsAPISchema = APISuccessSchema.extend({
    comments: ProfileCommentsSchema
});



export type IProfileCommentsAPI = z.infer<typeof ProfileCommentsAPISchema>;