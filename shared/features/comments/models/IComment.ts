import z from "zod";
import { CommentContentSchema } from "./ICommentContent";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";



export const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    userId: z.string(),
    createdAt: DateFromStringSchema,
    parentCommentId: z.string().optional()
}).merge(CommentContentSchema);



export type IComment = z.infer<typeof CommentSchema>;