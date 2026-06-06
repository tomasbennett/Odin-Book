import z from "zod";
import { allowedTypes, maxFileSizeInBytes } from "../constants";


export const NewFileRequestSchema = z.custom<FileList | undefined>()
  .superRefine((files, ctx) => {
    if (!files || !(files instanceof FileList)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File is required",
      });
      return;
    }

    if (files.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one file must be uploaded.",
      });
      return;
    }

    const file = files.item(0)!;

    if (file.size > maxFileSizeInBytes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
          } MB`,
      });
    }

    if (!allowedTypes.includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File type is not allowed.",
      });
    }
  });


export type INewFileRequest = z.infer<typeof NewFileRequestSchema>;






