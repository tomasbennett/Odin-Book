import z from "zod";
import { allowedAllFileTypes, maxFileSizeInBytes } from "../../../../../shared/features/files/constants";
import { FilesMultipleOptionalSchema } from "../../../../../shared/features/files/models/INewOptionalFile";
import { POST_FILE_ARRAY_KEY } from "../../../../../shared/features/posts/constants";
import { CreatePostSchema } from "../../../../../shared/features/posts/models/ICreatePost";

export const CreatePostFrontendSchema = CreatePostSchema.extend({
    [POST_FILE_ARRAY_KEY]: FilesMultipleOptionalSchema(allowedAllFileTypes, maxFileSizeInBytes)
})
    .superRefine((data, ctx) => {
        const hasTextContent =
            !!data.content && data.content.trim() !== "";

        const hasFiles =
            !!data[POST_FILE_ARRAY_KEY] && data[POST_FILE_ARRAY_KEY].length > 0;


        if (!hasTextContent && !hasFiles) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Content or file must be provided!!!",
            });

            return;
        }

    });



export type ICreatePostFrontend = z.infer<typeof CreatePostFrontendSchema>;