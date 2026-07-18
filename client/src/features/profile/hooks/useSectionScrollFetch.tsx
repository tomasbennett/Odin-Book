import z from "zod";
import { IScrollFetchParams } from "../../../models/IScrollFetchParams";
import { useRef, useState } from "react";
import { useError } from "../../error/contexts/ErrorContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { knownError, noErrorCtxError, noSocketConnectionError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { errorPageRoute, homePageRoute } from "../../../constants/routes";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { IArrayProperties } from "../../../../../shared/features/util/models/IArrayProperties";
import { useScrollToBottomContainer } from "../../../hooks/useScrollToBottomContainer";

export function useSectionScrollFetch({
    url,
    fetchBody,
    appendData,
    limit,
    originalOffset,
    isOriginalFetchLoading,
    isMoreAvailable
}: IScrollFetchParams) {

    const errCtx = useError();
    const nav = useNavigate();
    const { setAuthLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();


    const isLoadingRef = useRef<boolean>(false);
    const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
    const offsetRef = useRef<number>(originalOffset);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState<boolean>(isMoreAvailable);

    const containerRef = useRef<HTMLElement | null>(null);

    const scrollFetch = async () => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        if (isLoadingRef.current || !isMoreDataAvailable || isOriginalFetchLoading) {
            return;
        }

        try {
            setIsLoadingState(true);
            isLoadingRef.current = true;

            const response = await jwtFetchHandler(url, fetchBody);

            if (response.returnType === "loginError") {
                setAuthLevel({ userType: "none" });
                errCtx.throwError(response.error);
                return;

            }

            if (response.returnType === "fetchError") {
                errCtx.throwError(response.error);
                return;

            }

            const resJSON = await response.data.json();

            const successResult = appendData(resJSON);
            if (successResult.success) {
                const length = successResult.dataLength;
                if (length < limit) {
                    setIsMoreDataAvailable(false);
                }
                offsetRef.current += limit;
                return;

            }

            
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
            setIsLoadingState(false);
            isLoadingRef.current = false;

        }
    }


    useScrollToBottomContainer(
        containerRef,
        50,
        scrollFetch,
        (
            !isOriginalFetchLoading && 
            !isLoadingState && 
            isMoreDataAvailable
        )
    )





    return {
        isLoadingState,
        isMoreDataAvailable,
        containerRef
    }



}