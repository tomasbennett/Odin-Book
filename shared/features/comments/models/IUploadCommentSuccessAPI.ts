import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { CommentSchema } from "./IComment";




export const UploadCommentSuccessAPISchema = APISuccessSchema.extend({
    comment: CommentSchema
});


export type IUploadCommentSuccessAPI = z.infer<typeof UploadCommentSuccessAPISchema>;