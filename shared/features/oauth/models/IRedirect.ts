import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";



export const RedirectUrlSchema = z.object({
    url: z.string(),
});


export type IRedirectUrl = z.infer<typeof RedirectUrlSchema>;






export const SuccessRedirectUrlSchema = APISuccessSchema.merge(RedirectUrlSchema);


export type ISuccessRedirectUrl = z.infer<typeof SuccessRedirectUrlSchema>;