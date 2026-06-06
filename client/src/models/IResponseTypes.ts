import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export type IResponseTypes<SuccessResType> =
    { type: "response", data: SuccessResType } | //, status: 200 | 201 | 204
    { type: "customError", error: ICustomErrorResponse, status: number } | 
    { type: "userAuthError", error: ICustomErrorResponse, status: 401 | 403 };