import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";




export const CreatePostSchema = z.object({
    content: z.string().optional(),
    title: z.string().optional()
}).merge(SocketSchema);



export type ICreatePost = z.infer<typeof CreatePostSchema>;