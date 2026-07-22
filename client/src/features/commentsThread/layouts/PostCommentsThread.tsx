import { CreatePostOrCommentInput } from "../../../components/CreatePostOrCommentInput";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { Comment } from "../../comments/components/Comment";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
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

                                <CreatePostOrCommentInput 
                                    placeHolder="Add a comment to this post here..."
                                />

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
                        
                        
                        </>



                }


            </div>
        
        </>
    )
}