import { NavigateFunction } from "react-router-dom";

import { FieldValues, UseFormSetError } from "react-hook-form";
import { ICustomErrorResponse, APIErrorSchema } from "../../../shared/features/api/models/APIErrorResponse";
import { ISignInError } from "../../../shared/features/auth/models/ILoginSchema";
import { accessTokenLocalStorageKey, jsonParsingError } from "../constants/constants";
import { NewAccessTokenRequest } from "./NewAccessTokenRequest";
import { GetAccessToken } from "./GetAccessToken";
import { IResponseTypes } from "../models/IResponseTypes";

export async function formResponseHandler(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction
): Promise<IResponseTypes<Response> | null> {
    const accessToken = await GetAccessToken(navigate);
    if (!accessToken) return null;

    if (accessToken.type !== "response") {
        return accessToken;
    }

    const res = await FetchHandlerHelper(
        url,
        fetchOptions,
        navigate,
        accessToken.data
    );


    return res;

}



async function FetchHandlerHelper(
    url: string,
    fetchOptions: RequestInit,
    navigate: NavigateFunction,
    accessToken: string,
    hasRetried: boolean = false
): Promise<IResponseTypes<Response> | null> {
    try {


        const authFetchOptions: RequestInit = {
            ...fetchOptions,
            headers: {
                ...fetchOptions?.headers,
                Authorization: `Bearer ${accessToken}`
            }
        }


        const response = await fetch(url, authFetchOptions);

        if (response.status >= 500 && response.status <= 599) {

            const serverError: ICustomErrorResponse = {
                ok: false,
                status: response.status,
                message: response?.statusText || "Internal Server Error"
            };

            try {
                const data = await response.json();

                const result = APIErrorSchema.safeParse(data);
                if (result.success) {
                    serverError.message = result.data.message;

                }

            } catch (err) {
                console.error("Error parsing server error response:", err);
                navigate('/error', {
                    replace: true,
                    state: {
                        error: jsonParsingError
                    }
                });

                return null;

            }

            navigate('/error', {
                replace: true,
                state: {
                    error: serverError
                }
            });

            return null;
        }


        if (response.status === 401) {
            console.log("DATA SENT CORRECTLY FROM ERROR HANDLER!!!");

            if (!hasRetried) {

                const newAccessToken = await NewAccessTokenRequest(navigate);
                if (!newAccessToken) return null;

                if (newAccessToken.type !== "response") {
                    return newAccessToken;
                }

                const res = await FetchHandlerHelper(
                    url,
                    fetchOptions,
                    navigate,
                    newAccessToken.data,
                    true
                );

                return res;

            }

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

        if (response.status === 403) {
            return {
                type: "userAuthError",
                status: 403,
                error: {
                    ok: false,
                    status: 403,
                    message: "You do not have permission to perform this action!!!"
                }
            };
        }


        //THIS DOESN'T MEAN THAT THE RESPONSE IS CORRECT OR NOT AN ERROR
        //WHAT WE DO ON THE COMPONENT END IS JUST CHECK THE TYPE FOR USERAUTH AND THEN RUN THE SAME FUNCTIONALITY WITH SETTING USEAUTH CONTEXT FROM THERE

        //SO ISSUE IS THAT WE ONLY REALLY WANT TO RETURN RESPONSE OR USERAUTHERROR HERE

        // const resJson = await response.json();

        // const customErrorResult = APIErrorSchema.safeParse(resJson);
        // if (customErrorResult.success) {
        //     return {
        //         type: "customError",
        //         status: response.status,
        //         error: customErrorResult.data
        //     };
        // }

        return {
            type: "response",
            // status: 200,
            data: response
        }


    } catch (error: unknown) {
        console.error("Error fetching folder page data:", error);

        if (!(error instanceof Error)) {
            navigate('/error', {
                replace: true,
                state: {
                    error: {
                        ok: false,
                        status: 0,
                        message: "An unknown error occurred."
                    }
                }
            });

            return null;
        }

        if (error.name === "AbortError") {
            console.log("Fetch aborted in catch block!!!");
            return null; // ??? Why return null here or error?

        }

        const customError: ICustomErrorResponse = {
            ok: false,
            status: 0,
            message: error.message
        };

        navigate('/error', {
            replace: true,
            state: {
                error: customError
            }
        });

        return null;

    }
}