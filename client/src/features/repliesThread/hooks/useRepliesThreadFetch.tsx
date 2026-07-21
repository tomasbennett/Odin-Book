import { useEffect, useRef, useState } from "react";
import { useError } from "../../error/contexts/ErrorContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { errorPageRoute, homePageRoute } from "../../../constants/routes";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { domain } from "../../../constants/EnvironmentAPI";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { PostRepliesSuccessAPISchema } from "../../../../../shared/features/posts/models/IPostRepliesSuccessAPI";
import { unMountComponentAbort } from "../../../constants/AbortFetch";

export function useRepliesThreadFetch() {

    const errCtx = useError();
    const nav = useNavigate();
    const { setAuthLevel } = useAuth();
    const { jwtFetchHandler } = useJWTFetch();

    const { postId } = useParams<"postId">();


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [post, setPost] = useState<IPost | null>(null);
    const [replies, setReplies] = useState<IPost[]>([]);
    const [parentPosts, setParentPosts] = useState<IPost[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchReplies = async () => {
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


            const response = await jwtFetchHandler(`${domain}/api/posts/${postId}/replies`, {
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

            const successResult = PostRepliesSuccessAPISchema.safeParse(resJSON);
            if (successResult.success) {
                const data = successResult.data;

                setParentPosts(data.parentPosts);
                setPost(data.post);
                setReplies(data.replies);
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

        fetchReplies();

        return () => {
            abortControllerRef.current?.abort(unMountComponentAbort);
        }

    }, [postId]);


    return {
        isLoading,
        post,
        replies,
        parentPosts,
        setPost,
        setReplies,
        setParentPosts
    }





}