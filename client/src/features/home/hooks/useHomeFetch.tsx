//SO I WANT TO FETCH POST INFORMATION HERE FROM THE URL OBJECT OF MOST LIKED, NEWEST OR OLDEST
//AFTER THAT I WANT TO MAKE IT SCROLL BASED SO THAT YOU FETCH MORE WHEN SCROLLING DOWN

import { useNavigate, useSearchParams } from "react-router-dom";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { ISortPostByQuery, SortPostByQuerySchema } from "../../../../../shared/features/posts/models/ISortPostsByQuery";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useError } from "../../error/contexts/ErrorContext";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useAuth } from "../../auth/contexts/AuthContext";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { errorPageRoute } from "../../../constants/routes";
import { sortPostsDefaultHomePage } from "../../../../../shared/features/home/constants";
import { IHomePostsQuery } from "../../../../../shared/features/home/models/IHomePostsQuery";
import { domain } from "../../../constants/EnvironmentAPI";
import { toQueryString } from "../../../util/ToQueryString";
import { SuccessHomePostsAPISchema } from "../../../../../shared/features/home/models/ISuccessAPIHomePosts";
import { useScrollToBottomContainer } from "../../../hooks/useScrollToBottomContainer";
import { unmountSortTypeAbort } from "../constants/fetchHomePosts";

export function useHomeFetch() {
    const nav = useNavigate();

    const postsContainerRef = useRef<HTMLDivElement | null>(null);


    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();
    const { setAuthLevel } = useAuth();
    


    const [searchParams] = useSearchParams();

    const rawSort = searchParams.get(sortKeyWord);

    const sort: ISortPostByQuery = useMemo<ISortPostByQuery>(() => {

        const sortResult = SortPostByQuerySchema.safeParse(rawSort);

        if (rawSort !== null && !sortResult.success) {
            errCtx?.throwError({
                ok: false,
                status: 0,
                message: "Sort query given doesn't match a sortable keyword!!!"
            });
        }
        
        return sortResult.success ? sortResult.data : sortPostsDefaultHomePage;


    }, [rawSort]);


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<IPost[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);
    const limit: number = 10;
    const [offset, setOffset] = useState<number>(0);
    const hasMorePosts = useRef<boolean>(true);

    const fetchPosts = async ({
        offset,
        limit,
        sort
    }: IHomePostsQuery) => {

        if (!errCtx) {
            nav(errorPageRoute, {
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        console.log(`DOES THE FETCH EVER RUN???`);

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setIsLoading(true);

            const query: IHomePostsQuery = {
                limit,
                offset,
                [sortKeyWord]: sort
            }

            console.log(`SO IT'S SOMETHING WRONG WITH THE FETCH`);

            const response = await jwtFetchHandler(`${domain}/api/home?${toQueryString(query)}`, {
                method: "GET",
                signal: controller.signal
            });

            console.log(`RESPONSE HAS RETURNED:`);

            if ((controller !== abortControllerRef.current) || (controller.signal.aborted && controller.signal.reason === unmountSortTypeAbort)) {
                return;
            }

            if (response.returnType === "fetchError") {
                errCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "loginError") {
                setAuthLevel({
                    userType: "none"
                });
                errCtx.throwError(response.error);
                return;
            }

            const resJSON = await response.data.json();

            const homePostsResult = SuccessHomePostsAPISchema.safeParse(resJSON);
            if (homePostsResult.success) {
                const apiPosts: IPost[] = homePostsResult.data.posts;
                
                if (apiPosts.length < limit) {
                    //REMOVE THE EVENT LISTENER FOR SCROLL PAGE TO LOAD MORE!!!
                    hasMorePosts.current = false;
                }


                setPosts(prev => {
                    return [...prev, ...apiPosts]
                });
                setOffset(offset + limit);


                return;
            }

            // hasMorePosts.current = false;

            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                errCtx.throwError(errorResult.data);
                return;
            }

            errCtx.throwError(notExpectedFormatError);
            return;



        } catch (error) {
            if (controller !== abortControllerRef.current) {
                console.log("Not current fetch request!!!");
                return;
            }

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return;
            }

            errCtx.throwError(unknownError);
            return;


        } finally {
            if (controller !== abortControllerRef.current) {
                console.log("Does this ever run to prevent loading being false???");
                return;
            }

            console.log(`IF THIS GETS SET TO FALSE THEN WHY ISN'T THE USEEFFECT RUNNING???`);

            setIsLoading(false);
        }

    }


    useEffect(() => {
        console.log(`This is designed to show the latest isLoading value: ${isLoading}`);
    }, [isLoading])


    //SO WHY THIS CURRENTLY DOESN'T WORK IS BECAUSE THE FUNCTION NEEDS TO BE REATTACHED TO THE EVENT LISTENER EVERY TIME ISLOADING OR OFFSET CHANGES GIVEN THAT THEY ARE VARIABLE!!!
    const scrollForMoreFetch = useCallback(() => {
        //SO I WANT TO TEST WHETHER OR NOT A CHANGE LATER DOWN THE LINE CHANGES THIS
        //
        console.log(`The isLoading variable should change when the state changes, it's current value is: ${isLoading}`);
        
        if (isLoading || !(hasMorePosts.current)) {
            return;
        }
        
        fetchPosts({
            offset,
            limit,
            sort
        });
        
    }, [isLoading, offset, sort]);

    //NEED TO CHANGE USESTATE OLD STALE VALUES TO USEREF
    //HOLD ON NEED TO CHECK THIS PRINCIPLE, DOES IT LOG CURRENT VALUE OR ONE AT FUNC CREATION???
    useScrollToBottomContainer(
        postsContainerRef,
        50,
        scrollForMoreFetch
    );


    useEffect(() => {
        setOffset(0);
        setPosts([]);
        hasMorePosts.current = true;

        fetchPosts({
            offset: 0,
            limit,
            sort
        });

        return () => {
            abortControllerRef.current?.abort(unmountSortTypeAbort);
        }

    }, [sort]);

    return {
        isLoading,
        posts,
        sort,
        postsContainerRef
    }


}