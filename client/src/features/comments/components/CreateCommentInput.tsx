import { Navigate, useNavigate } from "react-router-dom";
import { IComment } from "../../../../../shared/features/comments/models/IComment";
import { UploadCommentSuccessAPISchema } from "../../../../../shared/features/comments/models/IUploadCommentSuccessAPI";
import { allowedAllFileTypes, allowedImgTypes, maxFileSizeInBytes } from "../../../../../shared/features/files/constants";
import { domain } from "../../../constants/EnvironmentAPI";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { CreateUIForm } from "../../textInput/layouts/CreateUIForm";
import { IInputMessageParse, IParseResponseFunc } from "../../textInput/models/IInputMessageErrors";
import { CreateCommentFrontendSchema, ICreateCommentFrontend } from "../models/ICreateCommentsFrontend";
import styles from "./CreateCommentInput.module.css";
import { homePageRoute } from "../../../constants/routes";
import { COMMENT_IMG_GIF_KEY } from "../../../../../shared/features/comments/constants";
import { filesToFileList } from "../../../util/filesToFileList";
import { noSocketConnectionError } from "../../../constants/errorConstants";

type ICreateCommentInputProps = {
    setComments: React.Dispatch<React.SetStateAction<IComment[]>>,
    postId: string,
    parentCommentId?: string | undefined
}

export function CreateCommentInput({
    setComments,
    postId,
    parentCommentId
}: ICreateCommentInputProps) {

    const socket = useSocket();

    
    const parseInput: IInputMessageParse = ({ textContent, files }) => {
        if (!socket || !socket.id) {
            return {
                success: false,
                error: {
                    files: undefined,
                    content: undefined,
                    root: noSocketConnectionError.message
                }
            };
        }

        const newComment: ICreateCommentFrontend = {
            senderSocketId: socket.id,
            parentCommentId,
            postId,
            content: textContent,
            [COMMENT_IMG_GIF_KEY]: filesToFileList(files)
        }

        const result = CreateCommentFrontendSchema.safeParse(newComment);
        if (!result.success) {
            const err = result.error.flatten();

            return {
                success: false,
                error: {
                    content: err.fieldErrors.content?.[0],
                    files: err.fieldErrors[COMMENT_IMG_GIF_KEY]?.[0],
                    root: err.formErrors?.[0]
                }
            }
        }

        const formData = new FormData();
        formData.append("senderSocketId", socket.id);
        formData.append("postId", postId);
        if (parentCommentId) formData.append("parentCommentId", parentCommentId);
        if (textContent) formData.append("content", textContent);
        if (newComment[COMMENT_IMG_GIF_KEY]) {
            const formFiles = newComment[COMMENT_IMG_GIF_KEY];
            for (let i = 0; i < formFiles.length; i++) {
                formData.append(COMMENT_IMG_GIF_KEY, formFiles[i]);
            }
        }


        return {
            success: true,
            fetchUrl: `${domain}/api/comments`,
            reqBody: {
                method: "POST",
                body: formData
            }
        }

    }

    const parseResponse: IParseResponseFunc = (data) => {
        const result = UploadCommentSuccessAPISchema.safeParse(data);

        if (result.success) {
            setComments(prev => {
                return [result.data.comment, ...prev]
            });

            return {
                ok: true
            }
        }

        return {
            ok: false
        }

    }


    return (
        <>
        
            <CreateUIForm 
                parseInputFunc={parseInput}
                parseResponseFunc={parseResponse}
                allowedFileMimeTypes={allowedImgTypes}
                allowedMaxFileSize={maxFileSizeInBytes}
            />
        
        </>
    )
}