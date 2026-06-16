import z from "zod";



export const SocketSchema = z.object({
    senderSocketId: z.string()
});



export type ISocketSchema = z.infer<typeof SocketSchema>;