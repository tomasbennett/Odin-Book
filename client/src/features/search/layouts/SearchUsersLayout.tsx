import { useMediaQuery } from "react-responsive";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { SearchBar } from "../components/SearchBar";
import { UserResult } from "../components/UserResult";
import { useSearchUser } from "../hooks/useSearchUser";
import styles from "./SearchUsersLayout.module.css";
import { useMemo } from "react";
import { thinScreenMaxWidth, mediumScreenMaxWidth } from "../../../constants/screenDimensions";




export function SearchUsersLayout() {

    const {
        isLoading,
        isMoreLoadable,
        searchText,
        setSearchText,
        searchResults,
        loadMoreUsers,
        searchResultsContainerRef
    } = useSearchUser();

    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });

    const screenWidthClassName = useMemo<string>(() => {

        return isThinScreen ? styles.thinScreen : isMediumScreen ? styles.mediumScreen : styles.wideScreen;
    }, [isThinScreen, isMediumScreen]);


    return (
        <>

            <div className={`
                ${styles.searchUsersLayoutContainer} 
                ${screenWidthClassName}
                `}>

                <div className={styles.searchBarContainer}>
                    <SearchBar
                        searchText={searchText}
                        setSearchText={setSearchText}
                    />
                </div>

                {
                    searchResults.length > 0 && (
                        <div ref={searchResultsContainerRef} className={styles.searchResultsContainer}>
                            {
                                searchResults.map((user) => (
                                    <UserResult
                                        key={user.userId}
                                        userId={user.userId}
                                        username={user.username}
                                        userEmail={user.userEmail}
                                        userProfileImgUrl={user.userProfileImgUrl}
                                    />
                                ))
                            }
                        </div>
                    )
                }


                {
                    isLoading && (
                        <div className={styles.loadContainer}>
                            <LoadingCircle height="4rem" />
                        </div>
                    )
                }

            </div>



        </>
    )



}