import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { PostRepliesSuccessAPISchema } from "../../../../../shared/features/posts/models/IPostRepliesSuccessAPI";
import { unMountComponentAbort } from "../../../constants/AbortFetch";
import { noErrorCtxError, notExpectedFormatError, knownError, unknownError } from "../../../constants/errorConstants";
import { errorPageRoute, homePageRoute } from "../../../constants/routes";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useError } from "../../error/contexts/ErrorContext";
import { domain } from "../../../constants/EnvironmentAPI";
import { IComment } from "../../../../../shared/features/comments/models/IComment";
import { PostCommentsThreadAPISchema } from "../../../../../shared/features/posts/models/IPostCommentsThread";

export function usePostCommentThreadFetch() {

    const errCtx = useError();
    const nav = useNavigate();
    const { setAuthLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();

    const { postId } = useParams<"postId">();


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [post, setPost] = useState<IPost | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchCommentsThread = async () => {
        if (!errCtx) {
            nav(errorPageRoute, {
                replace: true,
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        if (!postId) {
            errCtx.throwError({
                ok: false,
                status: 404,
                message: "No post ID provided in the search!!!"
            });

            nav(homePageRoute, {
                replace: true,
                // state: {
                //     error: 
                // }
            });

            return;

        }

        const controller = new AbortController();
        abortControllerRef.current = controller;


        try {

            setIsLoading(true);


            const response = await jwtFetchHandler(`${domain}/api/posts/${postId}/comments`, {
                method: "GET",
                signal: controller.signal
            });

            if (controller.signal.aborted && controller.signal.reason === unMountComponentAbort) {
                return;
            }

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

            const successResult = PostCommentsThreadAPISchema.safeParse(resJSON);
            if (successResult.success) {
                const data = successResult.data;

                setPost(data.post);
                setComments(data.directChildComments);
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
            setIsLoading(false);

        }
    }


    useEffect(() => {

        fetchCommentsThread();

        return () => {
            abortControllerRef.current?.abort(unMountComponentAbort);
        }

    }, [postId]);


    return {
        isLoading,
        post,
        setPost,
        comments,
        setComments
    }

    
}