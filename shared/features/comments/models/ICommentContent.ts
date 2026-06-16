import z from "zod";
import { FileDetailsSchema, IFileDetails } from "../../files/models/IFileDetails";
import { COMMENT_IMG_GIF_KEY } from "../constants";



export const CommentContentSchema = z.object({
    text: z.string().optional(),
    [COMMENT_IMG_GIF_KEY]: FileDetailsSchema.optional()
}).superRefine((data, ctx) => {
    const hasTextContent = !!data.text && data.text.trim() !== "";
    const hasFiles = !!data[COMMENT_IMG_GIF_KEY];

    if (hasTextContent) {
        return;
    }

    if (!hasFiles) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Either content or file details must be provided!!!",
            path: ["content"],
        });
        return;
    }

});


export type ICommentContent = z.infer<typeof CommentContentSchema>