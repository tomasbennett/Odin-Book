import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";



export const SendLikeCommentSchema = SocketSchema;



export type ISendLikeComment = z.infer<typeof SendLikeCommentSchema>;