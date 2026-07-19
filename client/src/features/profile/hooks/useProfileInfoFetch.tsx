//SO WHAT WE WANT TO HAVE IN EFFECT IS DATA THAT PERSISTS UNTIL THE END OF /:userId/profile/:replies||:comments||:posts WHERE :userId CAN BE /me AS WELL??? THIS MIGHT ACTUALLY GO UNDER QUERY INSTEAD OF PARAM LIKE filter="replies" AND THEN THIS IS A DEFAULT index: true???
//WHAT THIS WILL MEAN IS THAT CLICKING ON THE PANEL BELOW TO SELECT WHICH OF THE THREE OPTIONS WE WANT WILL TAKE US TO THE OTHER URL BUT FOR AS LONG AS THE /:userId/profile/ STILL EXISTS THE STATE DATA WILL ALL REMAIN THE SAME
//THIS COULD MESS WITH FETCH REQUESTS AND POSITIONING OF AN INFINITE SCROLL COMPONENT SO WE NEED TO BE CAREFUL TO ENSURE THAT IF WE GO TO THE BOTTOM OF REPLIES LETS SAY AND MOVE OVER TO COMMENTS THEN GO BACK TO REPLIES BEFORE IT HAS LOADED THEN WE DON'T SEND THE SAME REQUEST TWICE
//MIGHT NEED AN ABORT FOR SIMPLICITY OR AN ASSOCIATION OF ONE ASYNC OPERATION AT A TIME BELONGING TO EACH SECTION 

//ALRIGHT SO I DON'T THINK I HAVE ANY PROBLEM WITH THE NAVIGATION SYSTEM INSTEAD OF STATE NOW BUT I NEED TO THINK ABOUT HOW I WANT THESE REQUESTS TO OPERATE AND SPECFICALLY THE ABORT CONTROLLER
//ALSO WITH THE SCROLL HOOK I NEED TO FIGURE OUT HOW THIS WILL WORK WHEN SOMETIMES THIS USEREF MIGHT APPEAR TO BE NULL IF UNMOUNTED???
//SO THE DIFFICULT PART IS THAT WE KIND OF DO WANT EACH STATE TO CONTROL ITS OWN FETCHES IRREPRESENTIVE OF WHAT THE OTHER STATES ARE DOING AND TURNING PAGES WITH THE EXCEPTION OF IF WE LEAVE THE PAGE ENTIRELY
//THIS IS BECAUSE IF WE SCROLL DOWN THEN GO TO A DIFFERENT STATE THEN COME BACK WITHOUT SCROLLING WE COULD BE AT THE BOTTOM OF THE PAGE WAITING ON A SCROLL WHICH ISN'T GOOD

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useError } from "../../error/contexts/ErrorContext";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { IComment } from "../../../../../shared/features/comments/models/IComment";
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { useAuth } from "../../auth/contexts/AuthContext";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { profileDefaultStateQueryValue, profileStateQueryKey } from "../constants/profileStateQueryKey";
import { ISortPostByQuery } from "../../../../../shared/features/posts/models/ISortPostsByQuery";
import { IProfileSections, ProfileSectionsSchema } from "../models/IProfileSections";
import { defaultProfileCommentsLimit, defaultProfilePostsLimit, defaultProfileRepliesLimit } from "../../../../../shared/features/profiles/constants";
import { ISearchQuery } from "../../../../../shared/features/util/models/ISearchQuery";
import { toQueryString } from "../../../util/ToQueryString";
import { errorPageRoute } from "../../../constants/routes";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { APIErrorSchema } from "../../../../../shared/features/api/models/APIErrorResponse";
import { domain } from "../../../constants/EnvironmentAPI";
import { ProfileAPISuccessSchema } from "../../../../../shared/features/profiles/models/IProfileAPI";
import { useScrollToBottomContainer } from "../../../hooks/useScrollToBottomContainer";
import { ProfilePostsAPISuccessSchema } from "../../../../../shared/features/profiles/models/IProfilePosts";
import { Controller } from "react-hook-form";
import { abortInitialFetchRequest } from "../constants/abortFetchReq";


export function useProfileInfoFetch() {

    const nav = useNavigate();
    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();
    const { setAuthLevel } = useAuth();
    const [searchParams] = useSearchParams();
    const { userId } = useParams<"userId">();

    const rawState = searchParams.get(profileStateQueryKey);

    const parsed = ProfileSectionsSchema.safeParse(rawState);

    const state =
        parsed.success
            ? parsed.data
            : profileDefaultStateQueryValue;

    useEffect(() => {
        if (parsed.success) {
            return;
        }

        nav(
            `/profile/${userId}?${profileStateQueryKey}=${profileDefaultStateQueryValue.toLowerCase()}`,
            { replace: true }
        );
    }, [parsed.success, userId, nav]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [replies, setReplies] = useState<IPost[]>([]);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [headerInfo, setHeaderInfo] = useState<IProfileHeader | null>(null);

    // const [postsOffset, setPostsOffset] = useState<number>(defaultProfilePostsLimit);
    // const [repliesOffset, setRepliesOffset] = useState<number>(defaultProfileRepliesLimit);
    // const [commentsOffset, setCommentsOffset] = useState<number>(defaultProfileCommentsLimit);
    // const limitExtraReplies: number = 10;
    // const limitExtraPosts: number = 10;
    // const limitExtraComments: number = 10;

    // const repliesContainerRef = useRef<HTMLDivElement | null>(null);
    // const postsContainerRef = useRef<HTMLDivElement | null>(null);
    // const commentsContainerRef = useRef<HTMLDivElement | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    const getProfileInfo = async () => {


        if (!errCtx) {
            nav(errorPageRoute, {
                state: {
                    error: noErrorCtxError
                },
                replace: true
            });
            return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {

            setIsLoading(true);

            const response = await jwtFetchHandler(`${domain}/api/profile/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: controller.signal
            });

            if (controller.signal.aborted && controller.signal.reason === abortInitialFetchRequest) {
                return;
            }

            if (response.returnType === "fetchError") {
                errCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "loginError") {
                setAuthLevel({ userType: "none" });
                errCtx.throwError(response.error);
                return;

            }

            const resJSON = await response.data.json();

            const successResult = ProfileAPISuccessSchema.safeParse(resJSON);
            if (successResult.success) {
                setHeaderInfo(successResult.data.headerInfo);
                setReplies(successResult.data.replies);
                setPosts(successResult.data.posts);
                setComments(successResult.data.comments);

                return;
            }


            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                errCtx.throwError(errorResult.data);
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



    // const fetchExtraData = async (
    //     url: string,
    //     fetchBody: RequestInit,
    //     attemptSuccessCallback: (resJSON: unknown) => { successfulParse: boolean },
    //     limit: number,
    //     offset: number,
    // ) => {
    //     if (!errCtx) {
    //         nav(errorPageRoute, {
    //             state: {
    //                 error: noErrorCtxError
    //             },
    //             replace: true
    //         });
    //         return;
    //     }

    //     try {

    //         setIsLoading(true);

    //         const searchQuery: ISearchQuery = {
    //             limit,
    //             offset,
    //         }

    //         const response = await jwtFetchHandler(`${url}?${toQueryString(searchQuery)}`, fetchBody);

    //         if (response.returnType === "fetchError") {
    //             errCtx.throwError(response.error);
    //             return;
    //         }

    //         if (response.returnType === "loginError") {
    //             setAuthLevel({ userType: "none" });
    //             errCtx.throwError(response.error);
    //             return;

    //         }

    //         const resJSON = await response.data.json();

    //         const { successfulParse } = attemptSuccessCallback(resJSON);

    //         if (successfulParse) return;

    //         const errorResult = APIErrorSchema.safeParse(resJSON);
    //         if (errorResult.success) {
    //             errCtx.throwError(errorResult.data);
    //             return;
    //         }

    //         errCtx.throwError(notExpectedFormatError);
    //         return;


    //     } catch (error: unknown) {



    //         if (error instanceof Error) {
    //             errCtx.throwError(knownError(error));
    //             return;
    //         }

    //         errCtx.throwError(unknownError);
    //         return;


    //     } finally {
    //         setIsLoading(false);

    //     }


    // }



    // const postSuccessCallback = (resJSON: unknown): { successfulParse: boolean } => {

    //     const successResult = ProfilePostsAPISuccessSchema.safeParse(resJSON);
    //     if (successResult.success) {
    //         setPosts(prev => [...prev, ...successResult.data.posts]);
    //         setPostsOffset(prev => prev + successResult.data.posts.length);
    //         return { successfulParse: true };
    //     }

    //     return { successfulParse: false };
    // }

    // useScrollToBottomContainer(
    //     postsContainerRef,
    //     50,
    //     () => { fetchExtraData(
    //         `${domain}/api/posts/${userId}`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         },
    //         postSuccessCallback,
    //         limitExtraPosts,
    //         postsOffset
    //     ) }
    // )


    useEffect(() => {
        getProfileInfo();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(abortInitialFetchRequest);
            }
        }
    }, []);


    return {
        isLoading,
        replies,
        posts,
        comments,
        headerInfo,
        // repliesContainerRef,
        // postsContainerRef,
        // commentsContainerRef,
        state,
    }


}