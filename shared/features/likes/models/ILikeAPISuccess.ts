import z from "zod";
import { SuccessUploadLikeSchema } from "./ISuccessUploadLike";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";




export const LikeAPISuccessSchema = SuccessUploadLikeSchema.merge(APISuccessSchema);




export type ILikeAPISuccess = z.infer<typeof LikeAPISuccessSchema>;