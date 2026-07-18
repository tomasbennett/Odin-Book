import { useNavigate } from "react-router-dom";
import { useError } from "../../error/contexts/ErrorContext";
import { useImageUpload } from "../../../hooks/useImageUpload";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { domain } from "../../../constants/EnvironmentAPI";
import { IPatchUserProfileRequest } from "../../../../../shared/features/users/models/IRequestPatchUserProfile";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { errorPageRoute, homePageRoute } from "../../../constants/routes";
import { knownError, noErrorCtxError, noSocketConnectionError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY, PATCH_USER_PROFILE_IMG_KEY } from "../../../../../shared/features/users/constants";
import { useAuth } from "../../auth/contexts/AuthContext";
import { SuccessPatchUserProfileAPISchema } from "../../../../../shared/features/users/models/ISuccessPatchUserProfileAPI";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";


type IUploadFileKeys = typeof PATCH_USER_PROFILE_IMG_KEY | typeof PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY;

export function useProfileImgChange(
    uploadFileKey: IUploadFileKeys,
    defImgUrl: string | null
) {

    const errCtx = useError();
    const nav = useNavigate();
    const { jwtFetchHandler } = useJWTFetch();
    const socket = useSocket();
    const { setAuthLevel } = useAuth();
    
    const {
        // file,
        preview,
        handleInputChange,
        handleSingleFileChange,
        handleUrl,
        isLoading: isDefUrlLoading
    } = useImageUpload();

    // const [prevFile, setPrevFile] = useState<File | null>(null);
    const prevFileRef = useRef<File | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    
    const uploadNewImgFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        if (!socket || !socket.id) {
            nav(homePageRoute, {
                replace: true,
            });
            errCtx.throwError(noSocketConnectionError);
            return;
        }

        if (isDefUrlLoading) {
            errCtx.throwError({
                ok: false,
                status: 0,
                message: "Default image still loading!!!"
            });
            return;
        }

        const resPreview = handleInputChange(e);
        if (!resPreview.ok) {
            return;
        }

        const file = resPreview.file;



        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {

            const formData = new FormData();

            formData.append("senderSocketId", socket.id)
            formData.append(uploadFileKey, file);

            const response = await jwtFetchHandler(`${domain}/api/profile`, {
                method: "PATCH",
                signal: controller.signal,
                body: formData
            });

            if (controller !== abortControllerRef.current) {
                console.log("Previous profile image upload aborted!!!");
                return;
            }

            if (response.returnType === "loginError") {
                setAuthLevel({ userType: "none" });
                errCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "fetchError") {
                //SET TO PREVIOUS FILE!!!
                handleSingleFileChange(prevFileRef.current);
                errCtx.throwError(response.error);
                return;
            }

            const resJSON = await response.data.json();

            const successResult = SuccessPatchUserProfileAPISchema.safeParse(resJSON);
            if (successResult.success) {
                const imgUrl = successResult.data[uploadFileKey];

                prevFileRef.current = file; //TWO FILE VARIABLES BUT THIS SHOULD WORK TO SET THE CORRECT SERVER FILE AT ALL POINTS!!!

                return;

            }


            handleSingleFileChange(prevFileRef.current);

            const errResult = APIErrorSchema.safeParse(resJSON);
            if (errResult.success) {
                errCtx.throwError(errResult.data);
                return;
            }

            errCtx.throwError(notExpectedFormatError);
            return;



            
        } catch (error) {
            if (controller !== abortControllerRef.current) {
                console.log("Previous profile image upload aborted!!!");
                return;
            }

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return;
            }

            errCtx.throwError(unknownError);
            return;


        }
    }



    useEffect(() => {
        async function applyDefImg() {
            if (!defImgUrl) {
                return;
            }

            const res = await handleUrl(defImgUrl);

            if (!res.ok) {
                return;
            }

            prevFileRef.current = res.file;
            return;

        } 

        applyDefImg();
        
    }, [defImgUrl]);



    return {
        preview,
        uploadNewImgFile,
        isDefUrlLoading
    }



}