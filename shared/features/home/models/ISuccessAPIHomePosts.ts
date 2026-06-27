import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { PostSchema } from "../../posts/models/IPost";



export const SuccessHomePostsAPISchema = APISuccessSchema.extend({
    posts: z.array(PostSchema)
});


export type ISuccessHomePostsAPI = z.infer<typeof SuccessHomePostsAPISchema>;