import z from "zod";



export const DeletePostSuccessAPISchema = z.object({
    postId: z.string(),
    
});



export type IDeletePostSuccessAPI = z.infer<typeof DeletePostSuccessAPISchema>;