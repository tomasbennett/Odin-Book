import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { OAUTH_ERRORS, OAuthErrorKey } from "../../../shared/features/oauth/constants";
import { OAuthErrorCodeSchema } from "../../../shared/features/oauth/models/IErrorOAuth";
import { useError } from "../features/error/contexts/ErrorContext";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";


type IUseParamsErrorPopout = {
    setError?: (error: ICustomErrorResponse) => void;
};



export function useParamsErrorPopout({
    setError
}: IUseParamsErrorPopout) {

    const [searchParams, setSearchParams] = useSearchParams();

    const { throwError } = useError();

    useEffect(() => {
        const oauthError = searchParams.get(OAuthErrorKey);

        if (!oauthError) return;

        const oauthResult = OAuthErrorCodeSchema.safeParse(oauthError);

        if (!oauthResult.success) return;

        const errorCode = oauthResult.data;

        const displayError: ICustomErrorResponse = {
            ok: false,
            status: 0,
            message: `${errorCode}: ${OAUTH_ERRORS[errorCode]}`,
        }


        throwError(displayError);

        if (setError) {
            setError(displayError);
        }

        // const newParams = new URLSearchParams(searchParams);
        // newParams.delete(OAuthErrorKey);

        // setSearchParams(newParams, { replace: true });

    }, [searchParams, setSearchParams, setError]);

    return {};
}