import { Navigate } from "react-router-dom";
import { NoHeaderInfoError } from "../components/NoHeaderInfoError";
import { SectionsHeaders } from "../components/SectionsHeaders";
import { useProfileInfoFetch } from "../hooks/useProfileInfoFetch";
import { Header } from "./Header";
import styles from "./ProfileLayout.module.css";
import { homePageRoute } from "../../../constants/routes";
import { useSectionScrollFetch } from "../../../hooks/useSectionScrollFetch";
import { defaultProfileCommentsLimit, defaultProfilePostsLimit, defaultProfileRepliesLimit } from "../../../../../shared/features/profiles/constants";
import { ProfilePostsAPISuccessSchema } from "../../../../../shared/features/profiles/models/IProfilePosts";
import { domain } from "../../../constants/EnvironmentAPI";
import { ISearchQuery } from "../../../../../shared/features/util/models/ISearchQuery";
import { toQueryString } from "../../../util/ToQueryString";
import { ProfileRepliesAPISchema } from "../../../../../shared/features/profiles/models/IProfileReplies";
import { ProfileCommentsAPISchema } from "../../../../../shared/features/profiles/models/IProfileComments";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { Comment } from "../../comments/components/Comment";
import { Post } from "../../posts/components/Post";
import { COMMENT_IMG_GIF_KEY } from "../../../../../shared/features/comments/constants";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";




export function ProfileLayout() {

    const {
        isLoading: isInitialFetchLoading,
        replies,
        posts,
        comments,
        headerInfo,
        state,
        setComments,
        setPosts,
        setReplies,
        userId
    } = useProfileInfoFetch();

    if (!userId) {
        return <Navigate to={homePageRoute} replace={true} />
    }


    const {
        isLoadingState: isScrollPostsLoading,
        containerRef: postsContainerRef,
        isMoreDataAvailable: isMorePostsAvailable
    } = useSectionScrollFetch({
        url: `${domain}/api/posts/${userId}`,
        fetchBody: {
            method: "GET"
        },
        isOriginalFetchLoading: isInitialFetchLoading,
        isMoreAvailable: (posts.length === defaultProfilePostsLimit),
        limit: 10,
        originalOffset: defaultProfilePostsLimit,
        appendData: (data) => {
            const successResult = ProfilePostsAPISuccessSchema.safeParse(data);
            if (successResult.success) {
                const posts = successResult.data.posts;
                setPosts(prev => {
                    return [...prev, ...posts]
                });

                return {
                    success: true,
                    dataLength: posts.length
                }
            }
            return {
                success: false
            }
        }
    });

    const {
        isLoadingState: isScrollRepliesLoading,
        containerRef: repliesContainerRef,
        isMoreDataAvailable: isMoreRepliesAvailable
    } = useSectionScrollFetch({
        url: `${domain}/api/replies/${userId}`,
        fetchBody: {
            method: "GET"
        },
        isOriginalFetchLoading: isInitialFetchLoading,
        isMoreAvailable: (replies.length === defaultProfileRepliesLimit),
        limit: 10,
        originalOffset: defaultProfileRepliesLimit,
        appendData: (data) => {
            const successResult = ProfileRepliesAPISchema.safeParse(data);
            if (successResult.success) {
                const replies = successResult.data.replies;
                setReplies(prev => {
                    return [...prev, ...replies]
                });

                return {
                    success: true,
                    dataLength: replies.length
                }
            }
            return {
                success: false
            }
        }
    });

    const {
        isLoadingState: isScrollCommentsLoading,
        containerRef: commentsContainerRef,
        isMoreDataAvailable: isMoreCommentsAvailable
    } = useSectionScrollFetch({
        url: `${domain}/api/comments/${userId}`,
        fetchBody: {
            method: "GET"
        },
        isOriginalFetchLoading: isInitialFetchLoading,
        isMoreAvailable: (comments.length === defaultProfileCommentsLimit),
        limit: 20,
        originalOffset: defaultProfileCommentsLimit,
        appendData: (data) => {
            const successResult = ProfileCommentsAPISchema.safeParse(data);
            if (successResult.success) {
                const comments = successResult.data.comments;
                setComments(prev => {
                    return [...prev, ...comments]
                });

                return {
                    success: true,
                    dataLength: comments.length
                }
            }
            return {
                success: false
            }
        }
    });


    const loadingComponent = (
        <div className={styles.loadingContainer}>
            <LoadingCircle height="3rem" />
        </div>
    )




    return (
        <>
            <div className={styles.outerContainer}>


                <div className={styles.innerContainer}>
                    
                    <div className={styles.headerContainer}>

                        {
                            headerInfo === null ?
                                <NoHeaderInfoError />

                                :
                                //MAY NEED TO PASS THROUGH THE INTIAL LOADING STATE TO KEEP ALL LOADING CONSISTENT HERE
                                <Header
                                    userId={userId}
                                    username={headerInfo.username}
                                    userProfileImg={headerInfo.userProfileImg}
                                    accountCreatedAt={headerInfo.accountCreatedAt}
                                    accountBackgroundImg={headerInfo.accountBackgroundImg}
                                    aboutUser={headerInfo.aboutUser}
                                />

                        }



                    </div>

                    <div className={styles.sectionsOuterContainer}>

                        <div className={styles.sectionsHeaderContainer}>

                            <SectionsHeaders sectionType={state} />

                        </div>

                        <div className={styles.mainSectionsContainer}>



                            {
                                headerInfo === null ?
                                    <div className={styles.mainErrorContainer}>

                                        { /* This could be an svg detailing an error just like for the header as well!!!  */}
                                        <p>
                                            No user information given for this user!!!
                                        </p>

                                    </div>

                                    :

                                    isInitialFetchLoading ?

                                        (
                                            loadingComponent
                                        )

                                        :

                                        state === "comments" ?
                                            <div className={styles.contentContainer}>
                                                <>
                                                    {comments.map(comment => {
                                                        const imageProp = {
                                                            [COMMENT_IMG_GIF_KEY]: comment[COMMENT_IMG_GIF_KEY],
                                                        };

                                                        return (
                                                            <Comment
                                                                key={comment.id}
                                                                setLikeCount={createArrayLikeUpdater(comment.id, setComments)}
                                                                postId={comment.postId}
                                                                userId={userId}
                                                                username={comment.username}
                                                                createdAt={comment.createdAt}
                                                                commentCount={comment.commentCount}
                                                                id={comment.id}
                                                                likeCount={comment.likeCount}
                                                                haveYouLiked={comment.haveYouLiked}
                                                                userProfileImgUrl={comment.userProfileImgUrl}
                                                                parentCommentId={comment.parentCommentId}
                                                                text={comment.text}
                                                                {...imageProp}
                                                            />
                                                        );
                                                    })}

                                                    {isScrollCommentsLoading && !isInitialFetchLoading && (
                                                        (
                                                            loadingComponent
                                                        )
                                                    )}

                                                    {!isMoreCommentsAvailable && (
                                                        <p className={styles.noContentAvailable}>
                                                            {`No more comments from ${headerInfo.username ?? "this user!!!"}`}
                                                        </p>
                                                    )}
                                                </>
                                            </div>


                                            :

                                            state === "posts" ?
                                                <div className={styles.contentContainer}>

                                                    {posts.map(post => {

                                                        return (
                                                            <Post
                                                                key={post.id}
                                                                setLikesCount={createArrayLikeUpdater(post.id, setPosts)}
                                                                userId={userId}
                                                                username={post.username}
                                                                createdAt={post.createdAt}
                                                                commentCount={post.commentCount}
                                                                repliesCount={post.repliesCount}
                                                                id={post.id}
                                                                likeCount={post.likeCount}
                                                                haveYouLiked={post.haveYouLiked}
                                                                userProfileImgUrl={post.userProfileImgUrl}
                                                                title={post.title}
                                                                parentPost={post.parentPost}
                                                                content={post.content}
                                                                fileDetails={post.fileDetails}
                                                            />
                                                        )
                                                    })}


                                                    {
                                                        isScrollPostsLoading && !isInitialFetchLoading &&
                                                        (
                                                            loadingComponent
                                                        )
                                                    }

                                                    {
                                                        !isMorePostsAvailable &&
                                                        <p className={styles.noContentAvailable}>
                                                            {`No more posts from ${headerInfo.username ?? "this user!!!"}`}
                                                        </p>
                                                    }

                                                </div>

                                                :

                                                state === "replies" ?
                                                    <div className={styles.contentContainer}>
                                                        {
                                                            replies.map(reply => {

                                                                return (
                                                                    <Post
                                                                        key={reply.id}
                                                                        setLikesCount={createArrayLikeUpdater(reply.id, setReplies)}
                                                                        userId={userId}
                                                                        username={reply.username}
                                                                        createdAt={reply.createdAt}
                                                                        commentCount={reply.commentCount}
                                                                        repliesCount={reply.repliesCount}
                                                                        id={reply.id}
                                                                        likeCount={reply.likeCount}
                                                                        haveYouLiked={reply.haveYouLiked}
                                                                        userProfileImgUrl={reply.userProfileImgUrl}
                                                                        title={reply.title}
                                                                        parentPost={reply.parentPost}
                                                                        content={reply.content}
                                                                        fileDetails={reply.fileDetails}
                                                                    />
                                                                )
                                                            })
                                                        }

                                                        {
                                                            isScrollRepliesLoading && !isInitialFetchLoading &&
                                                            (
                                                                loadingComponent
                                                            )
                                                        }

                                                        {
                                                            !isMoreRepliesAvailable &&
                                                            <p className={styles.noContentAvailable}>
                                                                {`No more replies from ${headerInfo.username ?? "this user!!!"}`}
                                                            </p>
                                                        }

                                                    </div>

                                                    :

                                                    null

                            }

                        </div>


                    </div>

                </div>



            </div>
        </>
    );
}