import z from "zod";



export function MulterFileSingleOptionalSchema(allowedFileTypes: string[], maxFileSizeInBytes: number) {
    return z.custom<Express.Multer.File | undefined>()
        .superRefine((files, ctx) => {

            if (!files) {
                return;
            }


            const file = files;

            if (file.size > maxFileSizeInBytes) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
                        } MB`,
                });
            }

            if (!allowedFileTypes.includes(file.mimetype)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "File type is not allowed.",
                });
            }
        });
}


export function MulterFilesMultipleOptionalSchema(allowedFileTypes: string[], maxFileSizeInBytes: number) {
    return z.custom<Express.Multer.File[] | undefined>()
        .superRefine((files, ctx) => {
            if (!files || (typeof files === undefined)) {
                return;
            }


            if (files.length < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A minimum of one file must be uploaded.",
                });
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.size > maxFileSizeInBytes) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `File size must be less than ${maxFileSizeInBytes / 1024 / 1024
                            } MB`,
                    });
                    return;
                }

                if (!allowedFileTypes.includes(file.mimetype)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "File type is not allowed.",
                    });
                    return;
                }
            }
        });

}
