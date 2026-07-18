import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../../error/contexts/ErrorContext";
import { errorPageRoute } from "../../../constants/routes";
import { knownError, noErrorCtxError, noSocketConnectionError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { domain } from "../../../constants/EnvironmentAPI";
import { IPatchUserProfileRequest } from "../../../../../shared/features/users/models/IRequestPatchUserProfile";
import { useJWTSocketConnection } from "../../../hooks/useJWTSocketConnection";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { useAuth } from "../../auth/contexts/AuthContext";
import { SuccessPatchUserProfileAPISchema } from "../../../../../shared/features/users/models/ISuccessPatchUserProfileAPI";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";

export function useAboutUserEdit(defaultAboutUser: string) {

    const nav = useNavigate();
    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();
    const socket = useSocket();
    const { setAuthLevel } = useAuth();



    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aboutUserEditState, setAboutUserEditState] = useState<boolean>(false);

    const [aboutUserDraft, setAboutUserDraft] = useState<string>(defaultAboutUser);
    const [aboutUserServer, setAboutUserServer] = useState<string>(defaultAboutUser);



    const toggleAboutUserEditState = () => {
        if (isLoading) {
            return;
        }
        setAboutUserEditState((prevState) => !prevState);
    };

    const onCancel = () => {
        setAboutUserDraft(aboutUserServer);
        toggleAboutUserEditState();
        return;

    }

    const handleResponseError = (err: ICustomErrorResponse) => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        errCtx.throwError(err);
        setAboutUserDraft(aboutUserServer);
        setAboutUserEditState(false);
        return;

    }

    const patchAboutUser = async () => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        if (!socket || !socket.connected || !socket.id) {
            errCtx.throwError(noSocketConnectionError);
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noSocketConnectionError
                }
            });
            return;
        }

        if (aboutUserDraft === aboutUserServer) {
            toggleAboutUserEditState();
            return;
        }

        try {

            setIsLoading(true);

            const reBody: IPatchUserProfileRequest = {
                aboutUser: aboutUserDraft,
                senderSocketId: socket.id
            }

            const response = await jwtFetchHandler(`${domain}/api/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reBody)
            });

            if (response.returnType === "fetchError") {
                handleResponseError(response.error);
                return;
            }

            if (response.returnType === "loginError") {
                errCtx.throwError(response.error);
                setAuthLevel({ userType: "none" });
                return;
            }

            const resJSON = await response.data.json();

            const successResult = SuccessPatchUserProfileAPISchema.safeParse(resJSON);
            if (successResult.success) {
                setAboutUserEditState(false);
                setAboutUserServer(successResult.data.aboutMe || "");
                setAboutUserDraft(successResult.data.aboutMe || "")
                return;

            }

            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                handleResponseError(errorResult.data);
                return;
            }

            handleResponseError(notExpectedFormatError);
            return;


        } catch (error) {

            if (error instanceof Error) {
                handleResponseError(knownError(error));
                return;
            }

            handleResponseError(unknownError);
            return;


        } finally {
            setIsLoading(false);
        }
    }

    return {
        aboutUserEditState,
        toggleAboutUserEditState,
        isLoading,
        patchAboutUser,
        aboutUserDraft,
        setAboutUserDraft,
        aboutUserServer,
        setAboutUserServer,
        onCancel
    };
}