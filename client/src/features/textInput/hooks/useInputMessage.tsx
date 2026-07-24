import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { allowedAllFileTypes, maxFileSizeInBytes, allowedImgTypes } from "../../../../../shared/features/files/constants";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { errorPageRoute, homePageRoute } from "../../../constants/routes";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useError } from "../../error/contexts/ErrorContext";
import { IInputMessageBody, IInputMessageErrors, IInputMessageParse } from "../models/IInputMessageErrors";
import { IFileDetails } from "../../../../../shared/features/files/models/IFileDetails";



type IUseInputMessageParams = {
    parseInputFunc: IInputMessageParse,
    parseResponseFunc: (data: unknown) => { ok: true } | { ok: false }
    allowedFileMimeTypes: string[],
    allowedMaxFileSize: number
}



export function useInputMessage({
    parseInputFunc,
    parseResponseFunc,
    allowedFileMimeTypes,
    allowedMaxFileSize
}: IUseInputMessageParams) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<IInputMessageErrors>({
        content: undefined,
        files: undefined,
        root: undefined
    });


    const { setAuthLevel, authLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();
    const socket = useSocket();


    const [preppedFiles, setPreppedFiles] = useState<{ fileId: string, file: File }[]>([]);
    const [preppedFilePreviews, setPreppedFilePreviews] = useState<IFileDetails[]>([]);
    const [content, setContent] = useState<string>("");


    const errCtx = useError();
    const nav = useNavigate();





    const onSubmit = async () => {
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
            errCtx.throwError({
                ok: false,
                status: 0,
                message: "WebSocket connection is not established. Please try again later!!!"
            });
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: {
                        ok: false,
                        status: 0,
                        message: "WebSocket connection is not established. Please try again later!!!"
                    }
                }
            });
            return;
        }

        if (authLevel.userType !== "user") {
            errCtx.throwError({
                ok: false,
                status: 0,
                message: "You must be logged in to send messages!!!"
            });
            setAuthLevel({ userType: "none" });
            nav(homePageRoute, {
                replace: true
            });
            return;
        }


        try {
            setIsLoading(true);

            const snapshot: IInputMessageBody = {
                textContent: content,
                files: preppedFiles.map(f => f.file)
            };

            const isValidSubmission = parseInputFunc(snapshot);
            const filePreviewTypes: IFileDetails[] = [...preppedFilePreviews];

            if (!isValidSubmission.success) {
                const validationErrors = isValidSubmission.error;

                setErrors({
                    content: validationErrors.content,
                    files: validationErrors.files,
                    root: validationErrors.root
                });

                return;
            }

            // const data: IMessageContentFileArray = { ...isValidSubmission.data };


            // const reqBody: IMessageSendSocketData = {
            //     conversationId,
            //     content: data.content,
            //     userSocketId: socket.id,
            //     [FILES_KEY_NAME]: undefined
            // };

            // const formData = new FormData();

            // formData.append("conversationId", conversationId);
            // formData.append("userSocketId", socket.id);

            // if (data.content) {
            //     formData.append("content", data.content);
            // }

            // if (data[FILES_KEY_NAME]) {
            //     const files = data[FILES_KEY_NAME];
            //     for (let i = 0; i < files.length; i++) {
            //         formData.append(FILES_KEY_NAME, files[i]);
            //     }
            // }

            // const response = await jwtFetchHandler(`${domain}/api/messages`, {
            //     method: "POST",
            //     body: formData
            // });


            const url = isValidSubmission.fetchUrl;
            const body = isValidSubmission.reqBody;

            const response = await jwtFetchHandler(url, body);

            if (response.returnType === "fetchError") {
                errCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "loginError") {
                errCtx.throwError(response.error);
                setAuthLevel({ userType: "none" });
                return;
            }

            const resJSON = await response.data.json();

            const messageUploadResult = parseResponseFunc(resJSON);
            if (messageUploadResult.ok) {

                //ON SUBMIT CLEAR ALL STATES AS THE PREDEFINED VALUES WILL BE USED INSIDE OF ONMESSAGESENT
                //DO NOT URL.REVOKE OBJECT URLS HERE AS THEY ARE STILL NEEDED IN THE COMPONENT TO DISPLAY ON THE CONVERSATION
                setContent("");
                setPreppedFiles([]);
                setPreppedFilePreviews([]);
                setErrors({
                    content: undefined,
                    files: undefined,
                    root: undefined
                })

                // const submissionTime = new Date();

                // onMessageSent({
                //     conversationId,
                //     senderId: authLevel.userId,
                //     senderName: authLevel.username,
                //     senderProfileImgUrl: authLevel.userProfileImgUrl,
                //     content: data.content,
                //     timestamp: submissionTime,
                //     files: filePreviewTypes,
                //     messageId: messageUploadResult.data.messageId
                // });

                // setFriendMessages(prev => {
                //     return prev.map(friendConversation => {
                //         if (friendConversation.conversation.conversationId === conversationId) {
                //             const latestMessage: ILastMessageContentTypes = data.content ? {
                //                 messageType: "text",
                //                 textContent: data!.content!
                //             } : {
                //                 messageType: "file",
                //                 fileSize: filePreviewTypes[0].fileDetails.fileSizeInBytes
                //             };

                //             return {
                //                 ...friendConversation,
                //                 latestMessage: {
                //                     timestamp: submissionTime,
                //                     content: latestMessage
                //                 }
                //             }
                //         }

                //         return friendConversation;


                //     })
                // });
                return;

            }

            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                errCtx.throwError(errorResult.data);
                setErrors({
                    files: undefined,
                    content: undefined,
                    root: errorResult.data.message
                });
                return;
            }

            errCtx.throwError(notExpectedFormatError);
            setErrors({
                files: undefined,
                content: undefined,
                root: notExpectedFormatError.message
            });
            return;






        } catch (error) {
            if (error instanceof Error) {
                const err = knownError(error);
                errCtx.throwError(err);
                setErrors({
                    files: undefined,
                    content: undefined,
                    root: err.message
                });
                return;
            }

            errCtx.throwError(unknownError);
            setErrors({
                files: undefined,
                content: undefined,
                root: unknownError.message
            });
            return;


        } finally {
            setIsLoading(false);
        }

    }

    //???
    const prepFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files;

        if (!files || files.length === 0) {
            return;
        }

        const fileArray = Array.from(files);

        const invalidFile = fileArray.find(file =>
            !allowedFileMimeTypes.includes(file.type) ||
            file.size > allowedMaxFileSize
        );

        if (invalidFile) {
            setErrors(prev => ({
                ...prev,
                files: `File ${invalidFile.name} is either too large or of an unsupported file type.`
            }));

            return;
        }

        const filePreviews: {
            fileObjs: { fileId: string, file: File },
            previewFiles: IFileDetails
        }[] = fileArray.map((file) => {
            const previewUrl = URL.createObjectURL(file);

            const randomId = crypto.randomUUID();

            return {
                fileObjs: {
                    file,
                    fileId: randomId
                },
                previewFiles: {
                    id: randomId,
                    publicUrl: previewUrl,
                    name: file.name,
                    size: file.size,
                    mimetype: file.type,
                    createdAt: new Date()
                }
            }
        });

        setPreppedFilePreviews(prev => {
            return [...prev, ...filePreviews.map(file => file.previewFiles)]

        });
        setPreppedFiles(prev => {
            return [...prev, ...filePreviews.map(file => file.fileObjs)]
        });

        return;

    }


    const removeFile = (fileId: string) => {
        if (preppedFiles.length <= 0 || preppedFilePreviews.length <= 0) return;

        const fileToRemove = preppedFilePreviews.find(file => file.id === fileId);

        if (!fileToRemove) return;

        URL.revokeObjectURL(fileToRemove.publicUrl);

        setPreppedFilePreviews(prev => prev.filter(file => file.id !== fileId));
        setPreppedFiles(prev => prev.filter(file => file.fileId !== fileId));
        return;

    }


    useEffect(() => {
        setErrors({
            content: undefined,
            files: undefined,
            root: undefined
        });
    }, [content, preppedFiles]);

    return {
        content,
        setContent,
        onSubmit,
        prepFiles,
        removeFile,
        preppedFilePreviews,
        isLoading,
        errors
    }
}