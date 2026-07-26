import { allowedAllFileTypes, allowedImgTypes, maxFileSizeInBytes } from "../../../../../shared/features/files/constants";
import { POST_FILE_ARRAY_KEY } from "../../../../../shared/features/posts/constants";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { UploadPostSuccessAPISchema } from "../../../../../shared/features/posts/models/IUploadPostSuccessAPI";
import { domain } from "../../../constants/EnvironmentAPI";
import { noSocketConnectionError } from "../../../constants/errorConstants";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { filesToFileList } from "../../../util/filesToFileList";
import { CreateUIForm } from "../../textInput/layouts/CreateUIForm";
import { IInputMessageParse, IParseResponseFunc } from "../../textInput/models/IInputMessageErrors";
import { CreatePostFrontendSchema, ICreatePostFrontend } from "../models/ICreatePostFrontend";
import styles from "./CreatePostInput.module.css";


type ICreatePostInputProps = {
    setPosts: React.Dispatch<React.SetStateAction<IPost[]>>,
    parentPostId?: string | undefined
}

export function CreatePostInput({
    setPosts,
    parentPostId
}: ICreatePostInputProps) {


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

        const newPost: ICreatePostFrontend = {
            senderSocketId: socket.id,
            [POST_FILE_ARRAY_KEY]: filesToFileList(files),
            content: textContent,
            parentPostId
        }


        const result = CreatePostFrontendSchema.safeParse(newPost);
        if (!result.success) {

            const err = result.error.flatten();

            return {
                success: false,
                error: {
                    content: err.fieldErrors.content?.[0],
                    files: err.fieldErrors[POST_FILE_ARRAY_KEY]?.[0],
                    root: err.formErrors?.[0]
                }
            }

        }


        const formData = new FormData();
        formData.append("senderSocketId", socket.id);
        if (parentPostId) formData.append("parentPostId", parentPostId);
        if (textContent) formData.append("content", textContent);
        if (newPost[POST_FILE_ARRAY_KEY]) {
            const formFiles = newPost[POST_FILE_ARRAY_KEY];
            for (let i = 0; i < formFiles.length; i++) {
                formData.append(POST_FILE_ARRAY_KEY, formFiles[i]);
            }
        }

        return {
            success: true,
            fetchUrl: `${domain}/api/posts`,
            reqBody: {
                method: "POST",
                body: formData
            }
        }


    }

    const parseResponse: IParseResponseFunc = (data) => {

        const result = UploadPostSuccessAPISchema.safeParse(data);
        if (result.success) {
            setPosts(prev => {
                return [result.data.post, ...prev]
            });
            return {
                ok: true
            };
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
                allowedFileMimeTypes={allowedAllFileTypes}
                allowedMaxFileSize={maxFileSizeInBytes}
            />
        
        </>
    )


}