import z from "zod";
import { FileDetailsSchema, IFileDetails } from "../../files/models/IFileDetails";



export const CommentContentSchema = z.object({
    text: z.string().optional(),
    imgOrGifDetails: FileDetailsSchema.optional()
}).superRefine((data, ctx) => {
    const hasTextContent = !!data.text && data.text.trim() !== "";
    const hasFiles = !!data.imgOrGifDetails;

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