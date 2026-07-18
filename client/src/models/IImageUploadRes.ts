import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export type IImageUploadRes = ICustomErrorResponse | {
    ok: true,
    file: File
}