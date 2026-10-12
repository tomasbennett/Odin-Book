

import { useEffect } from "react";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { IOauthProvider } from "../../../../../shared/features/oauth/models/IOAuthProviders";
import { domain } from "../../../constants/EnvironmentAPI";
import { notExpectedFormatError, knownError, unknownError } from "../../../constants/errorConstants";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useError } from "../../error/contexts/ErrorContext";





export function useDeleteSocial() {

    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();
    const { setAuthLevel } = useAuth();

    const isLoading: Record<IOauthProvider, boolean> = {
        google: false,
        github: false,
    };

    // useEffect(() => {
    //     errCtx.throwError({
    //         ok: false,
    //         status: 2038,
    //         message: "WORKS???"
    //     })
    // }, [])

    const onDeleteSocialLink = async (
        social: IOauthProvider,
        onSuccess: () => void
    ) => {
        
        if (isLoading[social]) return; 
        
        try {
            isLoading[social] = true;

            const response = await jwtFetchHandler(`${domain}/api/oauth/${social}/unlink`, {
                method: "DELETE",
                // headers: {
                //     "Content-Type": "application/json"
                // }
            });

            console.log(response);

            if (response.returnType === "loginError") {
                setAuthLevel({ userType: "none" });
                errCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "fetchError") {
                errCtx.throwError(response.error);
                return;
            }


            if (response.data.status === 204) {
                onSuccess();
                return;
            }


            const data = await response.data.json();

            const errorResult = APIErrorSchema.safeParse(data);
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
            return;

        } finally {
            isLoading[social] = false;
        }
    }



    return {
        onDeleteSocialLink
    }


}