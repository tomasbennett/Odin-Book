import z from "zod";
import { COMMENT_IMG_GIF_KEY } from "../constants";
import { allowedImgTypes, maxFileSizeInBytes } from "../../files/constants";
import { FileSingleOptionalSchema } from "../../files/models/INewOptionalFile";



export const CreateCommentSchema = z.object({
    content: z.string().optional(),
    parentCommentId: z.string().optional(),
    postId: z.string(),
});



export type ICreateComment = z.infer<typeof CreateCommentSchema>;




