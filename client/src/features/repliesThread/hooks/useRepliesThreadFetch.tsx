import { useState } from "react";
import { useError } from "../../error/contexts/ErrorContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { errorPageRoute } from "../../../constants/routes";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";

export function useRepliesThreadFetch() {

    const errCtx = useError();
    const nav = useNavigate();
    const { setAuthLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();


    const [isLoading, setIsLoading] = useState<boolean>(true);


    const fetchReplies = () => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }


        try {

            setIsLoading(true);

            const errResult = APIErrorSchema.safeParse(resJSON);
            if (errResult.success) {
                errCtx.throwError(errResult.data);
                return;

            }

            errCtx.throwError(notExpectedFormatError);
            return;




        } catch (error: unknown) {

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return;
            }

            errCtx.throwError(unknownError);
            return;


        } finally {
            setIsLoading(false);

        }
    }


}