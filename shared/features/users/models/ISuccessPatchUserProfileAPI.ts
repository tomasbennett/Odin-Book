import z from "zod";
import { PatchUserProfileSchema } from "./IPatchUserProfile";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";



export const SuccessPatchUserProfileAPISchema = PatchUserProfileSchema.merge(APISuccessSchema);



export type ISuccessPatchUserProfileAPI = z.infer<typeof SuccessPatchUserProfileAPISchema>;