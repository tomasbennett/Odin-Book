import z from "zod";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";



export const FileDetailsSchema = z.object({
    id: z.string(),
    publicUrl: z.string(),
    name: z.string(),
    size: z.number().int().positive(),
    mimetype: z.string(),
    createdAt: DateFromStringSchema,
});



export type IFileDetails = z.infer<typeof FileDetailsSchema>;