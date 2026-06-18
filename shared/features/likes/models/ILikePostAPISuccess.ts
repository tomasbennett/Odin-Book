import z from "zod";
import { SuccessUploadLikePostSchema } from "./ISuccessUploadLikePost";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";





export const LikePostAPISuccessSchema = SuccessUploadLikePostSchema.merge(APISuccessSchema);


export type ILikePostAPISuccess = z.infer<typeof LikePostAPISuccessSchema>;