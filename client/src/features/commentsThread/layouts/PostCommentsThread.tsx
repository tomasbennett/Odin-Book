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
import { IComment } from "../../../../../shared/features/comments/models/IComment";



export function PostCommentsThread() {


    const {
        isLoading,
        post,
        setPost,
        comments,
        setComments
    } = usePostCommentThreadFetch();

    const setNewComment = (newComment: IComment) => {
        setComments(prevReplies => [newComment, ...prevReplies]);
        setPost(prevPost => {

            if (!prevPost) return prevPost;

            return {
                ...prevPost,
                commentCount: prevPost.commentCount + 1
            }
        });


    }

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
                                                    setLikesCount={createSingleLikeUpdater(setPost)}
                                                />
                                            
                                                <CreateCommentInput 
                                                    setNewComment={setNewComment}
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