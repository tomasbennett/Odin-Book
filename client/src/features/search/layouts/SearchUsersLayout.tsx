import { LoadingCircle } from "../../../components/LoadingCircle";
import { SearchBar } from "../components/SearchBar";
import { UserResult } from "../components/UserResult";
import { useSearchUser } from "../hooks/useSearchUser";
import styles from "./SearchUsersLayout.module.css";




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


    return (
        <>

            <div className={styles.searchUsersLayoutContainer}>

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
                            <LoadingCircle height="5rem" />
                        </div>
                    )
                }

            </div>



        </>
    )



}