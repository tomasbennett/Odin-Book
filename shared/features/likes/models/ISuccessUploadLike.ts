import z from "zod";




export const SuccessUploadLikeSchema = z.object({
    id: z.string(),
});



export type ISuccessUploadLike = z.infer<typeof SuccessUploadLikeSchema>;