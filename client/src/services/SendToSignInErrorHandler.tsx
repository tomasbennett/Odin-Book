import { NavigateFunction } from "react-router-dom";
import { ISignInError } from "../../../shared/features/auth/models/ILoginSchema";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export function SendToSignInErrorHandler(
    error: unknown,
    navigate: NavigateFunction
) {
    if (error instanceof Error) {
        const signInError: ICustomErrorResponse = {
            ok: false,
            status: 0,
            message: error.message
        }
        navigate("/error", {
            state: {
                error: signInError
            }
        });

        return;
    }


    const signInError: ICustomErrorResponse = {
        ok: false,
        status: 0,
        message: "An unknown error occurred."
    }
    navigate("/error", {
        state: {
            error: signInError
        }
    });
}