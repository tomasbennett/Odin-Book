import z from "zod";
import { FileDetailsSchema } from "../../files/models/IFileDetails";




export const PostContentSchema = z.object({
    content: z.string().optional(),
    fileDetails: z.array(FileDetailsSchema).optional()
}).superRefine((data, ctx) => {
    const hasTextContent = !!data.content && data.content.trim() !== "";
    const hasFiles = !!data.fileDetails && data.fileDetails.length > 0;

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


export type IPostContent = z.infer<typeof PostContentSchema>