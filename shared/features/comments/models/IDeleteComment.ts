import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";



export const DeleteCommentSchema = SocketSchema;



export type IDeleteComment = z.infer<typeof DeleteCommentSchema>;