import z from "zod";
import { PostContentSchema } from "./IPostContent";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { NumberFromStringSchema } from "../../util/models/INumber";




export const PostSchema = z.object({
    id: z.string(),
    userId: z.string(),
    username: z.string(),
    userProfileImgUrl: z.string().optional(),
    title: z.string().optional(),
    createdAt: DateFromStringSchema,
    likeCount: NumberFromStringSchema
}).merge(PostContentSchema);



export type IPost = z.infer<typeof PostSchema>;
