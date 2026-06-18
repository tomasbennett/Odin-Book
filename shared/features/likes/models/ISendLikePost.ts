import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";




export const SendLikePostSchema = SocketSchema;



export type ISendLikePost = z.infer<typeof SendLikePostSchema>;