import { LoadingCircle } from "../../../components/LoadingCircle";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
import { CreatePostInput } from "../../posts/components/CreatePostInput";
import { Post } from "../../posts/components/Post";
import { useRepliesThreadFetch } from "../hooks/useRepliesThreadFetch";
import styles from "./RepliesThreadLayout.module.css";



export function RepliesThreadLayout() {

    const {
        isLoading,
        post,
        replies,
        parentPosts,
        setParentPosts,
        setPost,
        setReplies
    } = useRepliesThreadFetch();


    return (

        <>

            <div className={styles.outerContainer}>

                {
                    isLoading ?
                        <div className={styles.loadingContainer}>

                            <LoadingCircle height="5rem" />

                        </div>

                        :

                        <>
                            {
                                parentPosts.map(parentPost => {


                                    return (
                                        <Post
                                            key={parentPost.id}
                                            {...parentPost}
                                            setLikesCount={createArrayLikeUpdater(parentPost.id, setParentPosts)}
                                        />
                                    )
                                })
                            }

                            <div className={styles.mainPostContainer}>
                                {
                                    post === null ?

                                        null

                                        :

                                        <>

                                            <Post
                                                {...post}
                                                setLikesCount={createSingleLikeUpdater(setPost)}
                                            />

                                            <CreatePostInput 
                                                setPosts={setReplies}
                                                parentPostId={post.parentPost?.parentPostId}
                                            />
                                        
                                        </>

                                }


                            </div>

                            {
                                replies.map(reply => {

                                    return (
                                        <Post
                                            key={reply.id}
                                            {...reply}
                                            setLikesCount={createArrayLikeUpdater(reply.id, setReplies)}
                                        />
                                    )
                                })
                            }


                        </>





                }



            </div>

        </>

    )
}