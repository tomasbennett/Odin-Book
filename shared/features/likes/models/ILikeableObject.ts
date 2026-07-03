import z from "zod";
import { NumberFromStringSchema } from "../../util/models/INumber";


export const LikeableObjectSchema = z.object({
    userId: z.string(),
    likeCount: NumberFromStringSchema,
    haveYouLiked: z.boolean(),
});


export type ILikeableObject = z.infer<typeof LikeableObjectSchema>;