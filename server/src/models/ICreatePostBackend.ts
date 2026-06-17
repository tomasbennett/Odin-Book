import z from "zod";
import { CreatePostSchema } from "../../../shared/features/posts/models/ICreatePost";
import { POST_FILE_ARRAY_KEY } from "../../../shared/features/posts/constants";
import { MulterFilesMultipleOptionalSchema } from "./IMulterFile";
import { allowedAllFileTypes, maxFileSizeInBytes } from "../../../shared/features/files/constants";



export const CreatePostBackendSchema = CreatePostSchema.extend({
    [POST_FILE_ARRAY_KEY]: MulterFilesMultipleOptionalSchema(allowedAllFileTypes, maxFileSizeInBytes),
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


    export type ICreatePostBackend = z.infer<typeof CreatePostBackendSchema>;