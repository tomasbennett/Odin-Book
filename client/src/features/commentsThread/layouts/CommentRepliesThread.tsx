import styles from "./CommentRepliesThread.module.css";

import { LoadingCircle } from "../../../components/LoadingCircle";
import { Comment } from "../../comments/components/Comment";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
import { Post } from "../../posts/components/Post";
import { usePostCommentThreadFetch } from "../hooks/usePostCommentsThreadFetch";
import { useCommentRepliesThreadFetch } from "../hooks/useCommentRepliesThreadFetch";
import { CreateCommentInput } from "../../comments/components/CreateCommentInput";



export function CommentRepliesThread() {


    const {
        isLoading,
        post,
        setPost,
        comment,
        setComment,
        replies,
        setReplies,
        parentComments,
        setParentComments
    } = useCommentRepliesThreadFetch();


    


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
                            <div className={styles.postInputContainer}>

                                {
                                    post === null ?
                                        null

                                        :

                                        <Post 
                                            {...post}
                                            setLikesCount={createSingleLikeUpdater(setPost)}
                                        />
                                }

                            </div>

                            {
                                parentComments.length > 0 ?
                                    <div className={styles.parentComments}>
                                        
                                        {
                                            parentComments.map(parentComment => {


                                                return (
                                                    <Comment 
                                                        key={parentComment.id}
                                                        {...parentComment}
                                                        setLikeCount={createArrayLikeUpdater(parentComment.id, setParentComments)}
                                                    />
                                                )
                                            })
                                        }

                                    </div>

                                :

                                null
                            }

                            <div className={styles.commentInputContainer}>

                                {
                                    comment === null ?
                                        null 

                                        :

                                        <Comment 
                                            key={comment.id}
                                            {...comment}
                                            setLikeCount={createSingleLikeUpdater(setComment)}
                                        />
                                }

                                {
                                    post === null ?
                                        null

                                        :

                                        <CreateCommentInput 
                                            setComments={setReplies}
                                            postId={post.id}
                                            parentCommentId={comment?.parentCommentId}
                                        />

                                }


                            </div>


                            <div className={styles.repliesContainer}>
                                
                                {
                                    replies.map(reply => {


                                        return (
                                            <Comment 
                                                key={reply.id}
                                                {...reply}
                                                setLikeCount={createArrayLikeUpdater(reply.id, setReplies)}
                                            />
                                        )
                                    })

                                }


                            </div>
                        
                        
                        </>



                }


            </div>
        
        </>
    )
}