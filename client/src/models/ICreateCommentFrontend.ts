import z from "zod";
import { CreateCommentSchema } from "../../../shared/features/comments/models/ICreateComment";
import { COMMENT_IMG_GIF_KEY } from "../../../shared/features/comments/constants";
import { FileSingleOptionalSchema } from "../../../shared/features/files/models/INewOptionalFile";
import { allowedImgTypes, maxFileSizeInBytes } from "../../../shared/features/files/constants";


export const CreateCommentFrontendSchema = CreateCommentSchema.extend({
    [COMMENT_IMG_GIF_KEY]: FileSingleOptionalSchema(allowedImgTypes, maxFileSizeInBytes)
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


export type ICreateCommentFrontend = z.infer<typeof CreateCommentFrontendSchema>;