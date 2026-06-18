import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";



export const DeletePostSchema = SocketSchema;



export type IDeletePost = z.infer<typeof DeletePostSchema>;