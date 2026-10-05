import { useNavigate } from "react-router-dom";
import { useJWTFetch } from "./useJWTFetch";
import { useError } from "../features/error/contexts/ErrorContext";
import { errorPageRoute } from "../constants/routes";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../constants/errorConstants";
import { domain } from "../constants/EnvironmentAPI";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { SuccessRedirectUrlSchema } from "../../../shared/features/oauth/models/IRedirect";
import { APIErrorSchema } from "../../../shared/features/api/models/APIErrorResponse";

type IUseSocialsLogin = {
    sessionUrl: (str: string) => string;
    reqOptions: RequestInit;
}




export function useSocialLogin({
    sessionUrl,
    reqOptions
}: IUseSocialsLogin) {

    // const { jwtFetchHandler } = useJWTFetch();

    const nav = useNavigate();

    const errCtx = useError();

    const { authLevel, setAuthLevel } = useAuth();

    const onAuth = async (websiteStr: string) => {

        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true, state: {
                    error: noErrorCtxError
                }
            });

            return;
        }


        try {

            const response = await fetch(websiteStr, reqOptions);


            // if (response.returnType === "fetchError") {
            //     errCtx.throwError(response.error);

            //     return;
            // }

            // if (response.returnType === "loginError") {
            //     if (authLevel.userType === "user") {
            //         setAuthLevel({
            //             userType: "none"
            //         });
            //     }
            //     errCtx.throwError(response.error);

            //     return;
            // }

            const resJSON = await response.json();

            const oauthResult = SuccessRedirectUrlSchema.safeParse(resJSON);
            if (oauthResult.success) {
                const redirectUrl = oauthResult.data.url;
                window.location.href = redirectUrl;

                return;
            }

            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                errCtx.throwError(errorResult.data);

                return;
            }

            errCtx.throwError(notExpectedFormatError);

            return;




        } catch (error) {
            if (error instanceof Error) {
                errCtx.throwError(knownError(error));

                return;
            }

            errCtx.throwError(unknownError);
        }


    }



    const onGmailClick = async () => {
        
        await onAuth(sessionUrl("google"));


    }

    const onLinkedInClick = async () => {
        await onAuth(sessionUrl("linkedin"));

    }

    const onGithubClick = async () => {
        await onAuth(sessionUrl("github"));
    }



    return {
        onGmailClick,
        onLinkedInClick,
        onGithubClick
    }





}