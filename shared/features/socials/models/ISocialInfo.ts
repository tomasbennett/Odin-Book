import z, { email } from "zod";




export const SocialInfoSchema = z.object({
    userId: z.string(),
    email: z.string().email().optional(),
    githubUsername: z.string().optional(),
    githubLink: z.string().optional(),
    linkedinUsername: z.string().optional(),
    linkedinLink: z.string().optional(),
});



export type ISocialInfo = z.infer<typeof SocialInfoSchema>;