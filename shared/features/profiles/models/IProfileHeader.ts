import z from "zod";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";



export const ProfileHeaderSchema = z.object({
    userId: z.string(),
    username: z.string(),
    userProfileImg: z.string().optional(),
    accountBackgroundImg: z.string().optional(),
    accountCreatedAt: DateFromStringSchema,
    aboutUser: z.string().optional()
});



export type IProfileHeader = z.infer<typeof ProfileHeaderSchema>;