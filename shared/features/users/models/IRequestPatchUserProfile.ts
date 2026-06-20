import z from "zod";
import { SocketSchema } from "../../socket/models/ISocketSchema";




export const PatchUserProfileRequestSchema = z.object({
    aboutUser: z.string().optional()
}).merge(SocketSchema);



export type IPatchUserProfileRequest = z.infer<typeof PatchUserProfileRequestSchema>;