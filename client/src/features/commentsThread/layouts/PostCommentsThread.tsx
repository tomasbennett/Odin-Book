import { useEffect } from "react";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { Comment } from "../../comments/components/Comment";
import { CreateCommentInput } from "../../comments/components/CreateCommentInput";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
import { CreatePostInput } from "../../posts/components/CreatePostInput";
import { Post } from "../../posts/components/Post";
import { usePostCommentThreadFetch } from "../hooks/usePostCommentsThreadFetch";
import styles from "./PostCommentsThread.module.css";



export function PostCommentsThread() {


    const {
        isLoading,
        post,
        setPost,
        comments,
        setComments
    } = usePostCommentThreadFetch();

    // useEffect(() => {
    //     setPost((prev) => {

    //         if (prev === null || post === null) {
    //             return prev;
    //         }

    //         return {
    //             ...prev,
    //             repliesCount: comments.length
    //         }
    //     });


    // }, [comments]);

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
                                
                                <div className={styles.postInputContainer}>

                                    {
                                        post === null ?
                                            null

                                            :

                                            <>
                                                <Post 
                                                    {...post}
                                                    commentCount={comments.length}
                                                    setLikesCount={createSingleLikeUpdater(setPost)}
                                                />
                                            
                                                <CreateCommentInput 
                                                    setComments={setComments}
                                                    postId={post.id}
                                                />
                                            </>

                                    }


                                </div>

                                <div className={styles.commentsContainer}>
                                    
                                    {
                                        comments.map(comment => {


                                            return (
                                                <Comment 
                                                    key={comment.id}
                                                    {...comment}
                                                    setLikeCount={createArrayLikeUpdater(comment.id, setComments)}
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