import z from "zod";
import { DateFromStringSchema } from "../../util/models/IDateFromStringSchema";
import { SocialInfoSchema } from "../../socials/models/ISocialInfo";



export const ProfileHeaderSchema = z.object({
    userId: z.string(),
    username: z.string(),
    userProfileImg: z.string().optional(),
    accountBackgroundImg: z.string().optional(),
    accountCreatedAt: DateFromStringSchema,
    aboutUser: z.string().optional()
})
.merge(SocialInfoSchema);



export type IProfileHeader = z.infer<typeof ProfileHeaderSchema>;