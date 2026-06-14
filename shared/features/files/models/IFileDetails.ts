import z from "zod";



export const FileDetailsSchema = z.object({
    id: z.string(),
    name: z.string(),
    size: z.number().int().positive(),
    type: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional()
});



export type IFileDetails = z.infer<typeof FileDetailsSchema>;