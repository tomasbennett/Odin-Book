import z from "zod";
import { CreateCommentSchema } from "../../../../../shared/features/comments/models/ICreateComment";
import { FileSingleOptionalSchema } from "../../../../../shared/features/files/models/INewOptionalFile";
import { COMMENT_IMG_GIF_KEY } from "../../../../../shared/features/comments/constants";
import { allowedImgTypes, maxFileSizeInBytes } from "../../../../../shared/features/files/constants";



export const CreateCommentFrontendSchema = CreateCommentSchema.extend({
    [COMMENT_IMG_GIF_KEY]: FileSingleOptionalSchema(allowedImgTypes, maxFileSizeInBytes).optional(),
})
    .superRefine((data, ctx) => {
        const hasContent =
            !!data.content &&
            data.content.trim() !== "";

        const hasFile =
            !!data[COMMENT_IMG_GIF_KEY] &&
            data[COMMENT_IMG_GIF_KEY].length > 0;

        if (!hasContent && !hasFile) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Either content or file must be provided."
            });

            return;
        }

        if (data[COMMENT_IMG_GIF_KEY] && data[COMMENT_IMG_GIF_KEY].length > 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Only one file is allowed!!!",
            });

            return;
        }

    });


export type ICreateCommentFrontend = z.infer<typeof CreateCommentFrontendSchema>;

