import styles from "./CommentRepliesThread.module.css";

import { LoadingCircle } from "../../../components/LoadingCircle";
import { Comment } from "../../comments/components/Comment";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
import { Post } from "../../posts/components/Post";
import { usePostCommentThreadFetch } from "../hooks/usePostCommentsThreadFetch";
import { useCommentRepliesThreadFetch } from "../hooks/useCommentRepliesThreadFetch";
import { CreateCommentInput } from "../../comments/components/CreateCommentInput";
import { useEffect } from "react";
import { IComment } from "../../../../../shared/features/comments/models/IComment";



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


    const setNewComment = (newComment: IComment) => {
        setReplies(prevReplies => [newComment, ...prevReplies]);
        setPost(prevPost => {

            if (!prevPost) return prevPost;

            return {
                ...prevPost,
                commentCount: prevPost.commentCount + 1
            }
        }
        );
        setParentComments(prevParentComments => {

            const updatedParentComments = prevParentComments.map(parentComment => {
                return {
                    ...parentComment,
                    commentCount: parentComment.commentCount + 1
                }
            });

            return updatedParentComments;
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
                                                setNewComment={setNewComment}
                                                postId={post.id}
                                                parentCommentId={comment?.id}
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

                            </div>


                        </>



                }


            </div>

        </>
    )
}