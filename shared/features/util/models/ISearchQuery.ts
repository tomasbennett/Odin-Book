import z from "zod";
import { NumberFromStringSchema } from "./INumber";



export const SearchQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(100).catch(10),
    offset: z.coerce.number().int().min(0).catch(0)
});


export type ISearchQuery = z.infer<typeof SearchQuerySchema>;