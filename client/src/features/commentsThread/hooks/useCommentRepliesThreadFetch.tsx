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
import { CommentsThreadAPIResponseSchema } from "../../../../../shared/features/commentsThread/models/ICommentsThreadAPI";

export function useCommentRepliesThreadFetch() {

    const errCtx = useError();
    const nav = useNavigate();
    const { setAuthLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();

    const { commentId } = useParams<"commentId">();


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [post, setPost] = useState<IPost | null>(null);
    const [parentComments, setParentComments] = useState<IComment[]>([])
    const [replies, setReplies] = useState<IComment[]>([]);
    const [comment, setComment] = useState<IComment | null>(null);

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

        if (!commentId) {
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


            const response = await jwtFetchHandler(`${domain}/api/comments/${commentId}/replies`, {
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

            const successResult = CommentsThreadAPIResponseSchema.safeParse(resJSON);
            if (successResult.success) {
                const data = successResult.data;

                setPost(data.post);
                setComment(data.comment);
                setReplies(data.replies);
                setParentComments(data.parentComments);
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

    }, [commentId]);


    return {
        isLoading,
        post,
        setPost,
        comment,
        setComment,
        parentComments,
        setParentComments,
        replies,
        setReplies
    }

    
}