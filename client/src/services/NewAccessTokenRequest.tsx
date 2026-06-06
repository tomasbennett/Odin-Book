import { NavigateFunction } from "react-router-dom";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { AccessTokenResponseSchema } from "../../../shared/features/auth/models/IAccessTokenResponse";
import { accessTokenLocalStorageKey, notExpectedFormatError } from "../constants/constants";
import { domain } from "../constants/EnvironmentAPI";
import { SendToSignInErrorHandler } from "./SendToSignInErrorHandler";
import { invalidRefreshTokenStatus } from "../../../shared/features/auth/constants";
import { IResponseTypes } from "../models/IResponseTypes";



export async function NewAccessTokenRequest(
    navigate: NavigateFunction
): Promise<IResponseTypes<string> | undefined> {

    try {

        console.log("THE NEW ACCESS TOKEN REQ RUNS");
        const newAccessTokenReq = await fetch(`${domain}/api/auth/refreshToken`, {
            credentials: "include"
        });
    
        if (newAccessTokenReq.status === invalidRefreshTokenStatus) {
            return {
                type: "userAuthError",
                status: 401,
                error: {
                    ok: false,
                    status: 401,
                    message: "Your session has expired. Please sign in again!!!"
                }
            };
        }

        if (newAccessTokenReq.status >= 500 && newAccessTokenReq.status <= 599) {
            const serverError: ICustomErrorResponse = {
                ok: false,
                status: newAccessTokenReq.status,
                message: "A server error occurred. Please try again later!!!"
            };
            navigate("/error", {
                state: {
                    error: serverError
                }
            });
            return;
        }

    
        const accessTokenJSON = await newAccessTokenReq.json();
    
        const accessTokenResult = AccessTokenResponseSchema.safeParse(accessTokenJSON);
        if (accessTokenResult.success) {
            localStorage.setItem(accessTokenLocalStorageKey, accessTokenResult.data.accessToken);
            return {
                type: "response",
                // status: 200,
                data: accessTokenResult.data.accessToken
            }
        }
    
        const apiCustomErrorResult = APIErrorSchema.safeParse(accessTokenJSON);
        if (apiCustomErrorResult.success) {
            return {
                type: "customError",
                status: apiCustomErrorResult.data.status,
                error: apiCustomErrorResult.data
            };
        }
    


        const signInError: ICustomErrorResponse = notExpectedFormatError;
        navigate("/error", {
            state: {
                error: signInError
            }
        });
        return;

    } catch (error) {

        console.log("ERROR OCCURS WHEN FETCHING without ACCESS TOKEN: ", error);
        SendToSignInErrorHandler(error, navigate);
        return; //ERROR PAGE THUS UNDEFINED RETURN

    }
}