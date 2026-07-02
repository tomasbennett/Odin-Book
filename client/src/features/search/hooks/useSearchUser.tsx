import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import { IUserSearchBar } from "../../../../../shared/features/users/models/ISearchBarUser";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useAuth } from "../../auth/contexts/AuthContext";
import { useError } from "../../error/contexts/ErrorContext";
import { emptySearchTextAbort } from "../../../constants/AbortFetch";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { errorPageRoute } from "../../../constants/routes";
import { toQueryString } from "../../../util/ToQueryString";
import { domain } from "../../../constants/EnvironmentAPI";
import { knownError, noErrorCtxError, notExpectedFormatError, unknownError } from "../../../constants/errorConstants";
import { ISearchQuery } from "../../../../../shared/features/util/models/ISearchQuery";
import { UserSearchedAPISuccessSchema } from "../../../../../shared/features/users/models/ISearchUserAPISuccess";
import { useScrollToBottomContainer } from "../../../hooks/useScrollToBottomContainer";

export function useSearchUser() {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchText, setSearchText] = useState<string>("");
    const [searchResults, setSearchResults] = useState<IUserSearchBar[]>([
        // {
        //     userId: "1",
        //     username: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam dolorum aut qui deserunt nemo amet unde nisi optio excepturi explicabo repudiandae, placeat omnis, vero ipsum cupiditate totam assumenda a ipsa ullam eligendi cumque neque ab! Illum vero eius velit aut libero. Saepe culpa, nobis officia dolorum quod quas minus repellendus!",
        //     prepstatus: "no_invite_prepped"
        // },
        // {
        //     userId: "2",
        //     username: "Cannon Basics",
        //     prepstatus: "invite_prepped"
        // },
        // {
        //     userId: "3",
        //     username: "JAMAL__DESPERADO",
        //     prepstatus: "invite_prepped"
        // },
        // {
        //     userId: "4",
        //     username: "CharredRemains123",
        //     prepstatus: "no_invite_prepped"
        // }
    ]);

    const [isMoreLoadable, setIsMoreLoadable] = useState<boolean>(true);

    const limit: number = 25;
    const [offset, setOffset] = useState<number>(0);


    const searchResultsContainerRef = useRef<HTMLDivElement | null>(null);


    const abortControllerRef = useRef<AbortController | null>(null);

    const { jwtFetchHandler } = useJWTFetch();
    const { setAuthLevel } = useAuth();
    const errorCtx = useError();


    const nav = useNavigate();

    useEffect(() => {
        setSearchResults([]);
        setOffset(0);
        setIsMoreLoadable(true);

        if (searchText.trim() === "") {
            abortControllerRef.current?.abort(emptySearchTextAbort);
            return;
        }

        searchUsers(setIsLoading, 0);

    }, [searchText]);



    async function searchUsers(
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        offset: number
    ) {

        if (!errorCtx) {
            nav(errorPageRoute, {
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;


        try {
            setIsLoading(true);

            const search = searchText;

            const queryParams: ISearchQuery = {
                limit,
                offset,
            }

            const generatedQueryParams = toQueryString(queryParams);

            const response = await jwtFetchHandler(`${domain}/api/users/search/${search}?${generatedQueryParams}`, {
                method: "GET",
                signal: controller.signal
            });


            if (controller !== abortControllerRef.current) {
                console.log("Not current fetch request!!!");
                return;
            }

            if (controller.signal.aborted && controller.signal.reason === emptySearchTextAbort) {
                console.log("Aborted without a new request sent do not impact state except for loading!!!");
                return;
            }

            if (response.returnType === "fetchError") {
                errorCtx.throwError(response.error);
                return;
            }

            if (response.returnType === "loginError") {
                setAuthLevel({
                    userType: "none"
                });
                errorCtx.throwError(response.error);
                return;
            }

            const resJSON = await response.data.json();

            const searchedUserResults = UserSearchedAPISuccessSchema.safeParse(resJSON);
            if (searchedUserResults.success) {
                console.log("Success on the searched users!!!");
                setSearchResults(prev => {
                    return [...prev, ...searchedUserResults.data.usersSearched]
                });
                setOffset(offset + limit);

                setIsMoreLoadable(searchedUserResults.data.usersSearched.length === limit)


                return;

            }

            const errorResult = APIErrorSchema.safeParse(resJSON);
            if (errorResult.success) {
                errorCtx.throwError(errorResult.data);
                return;
            }

            errorCtx.throwError(notExpectedFormatError);
            return;



        } catch (error: unknown) {
            console.error("Error inviting users to conversation:", error);

            if (controller !== abortControllerRef.current) {
                console.log("Not current fetch request!!!");
                return;
            }

            if (error instanceof Error) {
                errorCtx.throwError(knownError(error));
                return;
            }

            errorCtx.throwError(unknownError);
            return;


        } finally {
            if (controller !== abortControllerRef.current) {
                console.log("Not current fetch request!!!");
                return;
            }
            setIsLoading(false);
        }
    }

    const loadMoreUsers = useCallback(() => {
        if (isLoading || !isMoreLoadable) {
            console.log("Can not load more whilst search is loading or if there are no more results at the moment!!!");
            return;
        }


        searchUsers(setIsLoading, offset);

    }, [isLoading, isMoreLoadable, offset]);


    useScrollToBottomContainer(
        searchResultsContainerRef,
        50,
        loadMoreUsers,
        (searchResults.length > 0 && isMoreLoadable)
    )




    return {
        isLoading,
        isMoreLoadable,
        searchText,
        setSearchText,
        searchResults,
        loadMoreUsers,
        searchResultsContainerRef
    }

}