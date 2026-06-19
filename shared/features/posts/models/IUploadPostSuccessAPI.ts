import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { PostSchema } from "./IPost";
import { ProfileRepliesParentPostSchema } from "../../profiles/models/IProfileReplies";





export const UploadPostSuccessAPISchema = APISuccessSchema.extend({
    post: PostSchema,
});



export type IUploadPostSuccessAPI = z.infer<typeof UploadPostSuccessAPISchema>;