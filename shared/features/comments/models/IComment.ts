import z from "zod";
import { CommentContentSchema } from "./ICommentContent";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { NumberFromStringSchema } from "../../util/models/INumber";
import { LikeableObjectSchema } from "../../likes/models/ILikeableObject";



export const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    userId: z.string(),
    username: z.string(),
    userProfileImgUrl: z.string().optional(),
    createdAt: DateFromStringSchema,
    parentCommentId: z.string().optional(),
    likeCount: NumberFromStringSchema,
    commentCount: NumberFromStringSchema,
    // haveYouLiked: z.boolean(),
})
.merge(CommentContentSchema)
.merge(LikeableObjectSchema);



export type IComment = z.infer<typeof CommentSchema>;