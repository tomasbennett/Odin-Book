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
import { ProfilePostsAPISuccessSchema } from "../../../../../shared/features/profiles/models/IProfilePosts";

import githubProfileImg from "../../../assets/github-profile-img.jpg";
import cubeNightSky from "../../../assets/cube-night-sky.jpg";

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
    const [posts, setPosts] = useState<IPost[]>([
        {
            id: "1",
            userId: "1",
            username: "Ted_Kennedy",
            createdAt: new Date(),
            likeCount: 15,
            commentCount: 23,
            repliesCount: 1,
            title: "Check out this post I made!!!",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur deserunt, dolores asperiores aut nemo qui dolorum quaerat similique eveniet laborum ad amet cumque perspiciatis aspernatur delectus fuga error animi veritatis recusandae corporis adipisci at pariatur quisquam. Harum asperiores aperiam quod molestiae repellendus, consequatur autem, laborum labore quam animi fugiat assumenda. Mollitia nam fugit laborum! Voluptatibus maiores quasi iure deleniti mollitia voluptas reiciendis ut tempore odit earum, hic quod molestias, facilis dolores placeat qui harum, nulla id asperiores soluta!",
            userProfileImgUrl: undefined,
            parentPost: undefined,
            fileDetails: undefined
        },
        {
            id: "2",
            userId: "2",
            username: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit cupiditate incidunt cum, officiis illum dolorum neque rem eligendi ullam dolor recusandae natus nihil quia officia labore excepturi, consequuntur quos nesciunt.",
            createdAt: new Date("2022-06-08"),
            likeCount: 4,
            commentCount: 203,
            repliesCount: 3,
            title: undefined,
            content: "Yo",
            userProfileImgUrl: githubProfileImg,
            parentPost: undefined,
            fileDetails: [
                {
                    id: "1",
                    publicUrl: cubeNightSky,
                    name: "Cube night sky",
                    mimetype: "img/jpg",
                    size: 1300,
                    createdAt: new Date()
                },
                {
                    id: "2",
                    publicUrl: githubProfileImg,
                    name: "Github Profile img",
                    mimetype: "img/jpg",
                    size: 1600,
                    createdAt: new Date()
                },
                {
                    id: "3",
                    publicUrl: cubeNightSky,
                    name: "Cube night sky",
                    mimetype: "img/jpg",
                    size: 1300,
                    createdAt: new Date()
                },
            ]
        },
        {
            id: "3",
            userId: "3",
            username: "T",
            createdAt: new Date("2026-06-26"),
            likeCount: 0,
            commentCount: 1,
            repliesCount: 100,
            title: undefined,
            content: undefined,
            userProfileImgUrl: undefined,
            parentPost: undefined,
            fileDetails: [
                {
                    id: "1",
                    publicUrl: cubeNightSky,
                    name: "Cube night sky",
                    mimetype: "img/jpg",
                    size: 1300,
                    createdAt: new Date()
                },
            ]
        }
    ]);

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

            const homePostsResult = ProfilePostsAPISuccessSchema.safeParse(resJSON);
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
    // useScrollToBottomContainer(
    //     postsContainerRef,
    //     50,
    //     scrollForMoreFetch
    // );


    useEffect(() => {
        setOffset(0);
        // setPosts([]);
        hasMorePosts.current = true;

        // fetchPosts({
        //     offset: 0,
        //     limit,
        //     sort
        // }); 3 LINES REMOVED

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