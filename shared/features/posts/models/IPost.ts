import z, { email } from "zod";
import { PostContentSchema } from "./IPostContent";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { NumberFromStringSchema } from "../../util/models/INumber";
import { ProfileRepliesParentPostSchema } from "../../profiles/models/IRepliesParentPost";
import { LikeableObjectSchema } from "../../likes/models/ILikeableObject";



export const PostSchema = z.object({
    id: z.string(),
    userId: z.string(),
    username: z.string(),
    email: z.string().optional(),
    userProfileImgUrl: z.string().optional(),
    title: z.string().optional(),
    createdAt: DateFromStringSchema,
    likeCount: NumberFromStringSchema,
    commentCount: NumberFromStringSchema,
    repliesCount: NumberFromStringSchema,
    parentPost: ProfileRepliesParentPostSchema.optional(),
    // haveYouLiked: z.boolean(),
})
.merge(PostContentSchema)
.merge(LikeableObjectSchema);



export type IPost = z.infer<typeof PostSchema>;
