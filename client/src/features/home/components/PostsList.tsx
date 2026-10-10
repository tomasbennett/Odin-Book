import { useEffect, useRef } from "react";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { ProfilePostsAPISuccessSchema } from "../../../../../shared/features/profiles/models/IProfilePosts";
import { domain } from "../../../constants/EnvironmentAPI";
import { useSectionScrollFetch } from "../../../hooks/useSectionScrollFetch";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { Post } from "../../posts/components/Post";
import { useHomeFetch } from "../hooks/useHomeFetch";
import styles from "./PostsList.module.css";
import { useMediaQuery } from "react-responsive";
import { extraSmallScreenMaxWidth } from "../../../constants/screenDimensions";
import { AsideMenuLayout } from "../../aside/layout/AsideMenuLayout";
import { AsideBar } from "./AsideHomeContent";



type IPostListProps = {

} & ReturnType<typeof useHomeFetch>;


export function PostsList({
    limit,
    isLoading,
    posts,
    setPosts,
    sort
}: IPostListProps) {

    // const containerRef = useRef<HTMLDivElement | null>(null);

    const isExtraSmallScreen: boolean = useMediaQuery({ maxWidth: extraSmallScreenMaxWidth });

    const {
        isLoadingState: isScrollFetchLoading,
        isMoreDataAvailable,
        containerRef
    } = useSectionScrollFetch({
        url: `${domain}/api/home`,
        additionalQuery: {
            [sortKeyWord]: sort
        },
        fetchBody: {
            method: "GET"
        },
        appendData: (data) => {
            const result = ProfilePostsAPISuccessSchema.safeParse(data);

            if (!result.success) {
                return {
                    success: false
                }
            }

            setPosts(prev => {
                return [...prev, ...result.data.posts]
            });

            return {
                success: true,
                dataLength: result.data.posts.length
            }

        },
        originalOffset: posts.length,
        limit: 10,
        isOriginalFetchLoading: isLoading,
        isMoreAvailable: posts.length >= limit
    });



    useEffect(() => {
        console.log("SORT: ", sort);

    }, [sort]);

    return (
        <>

            <div className={styles.outerContainer}>

                

                <div ref={containerRef} className={styles.listScrollContainer}>


                    {
                        posts.map((post) => {


                            return (
                                <Post
                                    key={post.id}
                                    {...post}
                                    setLikesCount={createArrayLikeUpdater(post.id, setPosts)}
                                />
                            )
                        })
                    }


                </div>

                {
                    isExtraSmallScreen && (
                        <div className={styles.asideHomeSelectionContainer}>

                            <AsideBar sortType={sort} />

                        </div>
                    )
                }

            </div>

        </>
    )
}