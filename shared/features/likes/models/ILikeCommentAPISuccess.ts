import z from "zod";
import { SuccessUploadLikeCommentSchema } from "./ISuccessUploadLikeComment";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";




export const LikeCommentAPISuccessSchema = SuccessUploadLikeCommentSchema.merge(APISuccessSchema);




export type ILikeCommentAPISuccess = z.infer<typeof LikeCommentAPISuccessSchema>;