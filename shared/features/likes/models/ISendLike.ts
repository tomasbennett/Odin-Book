import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";



export const SendLikeSchema = SocketSchema;



export type ISendLike = z.infer<typeof SendLikeSchema>;