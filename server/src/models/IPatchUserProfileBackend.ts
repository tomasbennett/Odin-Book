import z from "zod";
import { PatchUserProfileRequestSchema } from "../../../shared/features/users/models/IRequestPatchUserProfile";
import { PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY, PATCH_USER_PROFILE_IMG_KEY } from "../../../shared/features/users/constants";
import { MulterFileSingleOptionalSchema } from "./IMulterFile";
import { allowedImgTypes, maxFileSizeInBytes } from "../../../shared/features/files/constants";





export const PatchUserProfileBackendRequestSchema = PatchUserProfileRequestSchema.extend({
    [PATCH_USER_PROFILE_IMG_KEY]: MulterFileSingleOptionalSchema(allowedImgTypes, maxFileSizeInBytes),
    [PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY]: MulterFileSingleOptionalSchema(allowedImgTypes, maxFileSizeInBytes)
});



export type IPatchUserProfileBackendRequest = z.infer<typeof PatchUserProfileBackendRequestSchema>;