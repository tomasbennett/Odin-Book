import z from "zod";
import { COMMENT_IMG_GIF_KEY } from "../../../shared/features/comments/constants";
import { CreateCommentSchema } from "../../../shared/features/comments/models/ICreateComment";



export const CreateCommentBackendSchema = CreateCommentSchema.extend({
    [COMMENT_IMG_GIF_KEY]: z.custom<Express.Multer.File | undefined>().optional(),
})
    .superRefine((data, ctx) => {
        const hasTextContent =
            !!data.content && data.content.trim() !== "";

        if (hasTextContent) {
            return;
        }

        if (!data[COMMENT_IMG_GIF_KEY]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Content or file must be provided!!!",
            });

            return;
        }

    });


    export type ICreateCommentBackend = z.infer<typeof CreateCommentBackendSchema>;