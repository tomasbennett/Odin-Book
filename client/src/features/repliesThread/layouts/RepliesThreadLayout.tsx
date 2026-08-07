import { useEffect } from "react";
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
        setPost,
        replies,
        setReplies,
        parentPosts,
        setParentPosts,
    } = useRepliesThreadFetch();

    // useEffect(() => {
    //     setPost((prev) => {

    //         if (prev === null || post === null) {
    //             return prev;
    //         }

    //         return {
    //             ...prev,
    //             repliesCount: replies.length
    //         }
    //     });

    // }, [replies]);



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
                            <div className={styles.innerContainer}>

                                <div className={styles.parentPostsContainer}>

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

                                </div>

                                <div className={styles.mainPostContainer}>
                                    {
                                        post === null ?

                                            null

                                            :

                                            <>

                                                <Post
                                                    {...post}
                                                    repliesCount={replies.length}
                                                    setLikesCount={createSingleLikeUpdater(setPost)}
                                                />

                                                <CreatePostInput 
                                                    setPosts={setReplies}
                                                    parentPostId={post.id}
                                                />
                                            
                                            </>

                                    }


                                </div>


                                <div className={styles.repliesContainer}>

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

                                </div>
                                
                            </div>


                        </>





                }



            </div>

        </>

    )
}