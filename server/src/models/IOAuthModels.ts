import z from "zod";



export const GmailOAuthResponseSchema = z.object({
    sub: z.string().min(1),
    email: z.email(),
});




export type IGmailOAuthResponse = z.infer<typeof GmailOAuthResponseSchema>;