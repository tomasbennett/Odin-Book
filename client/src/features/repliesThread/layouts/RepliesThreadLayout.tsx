import { useEffect } from "react";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { createSingleLikeUpdater } from "../../likes/services/likeSingleObjects";
import { CreatePostInput } from "../../posts/components/CreatePostInput";
import { Post } from "../../posts/components/Post";
import { useRepliesThreadFetch } from "../hooks/useRepliesThreadFetch";
import styles from "./RepliesThreadLayout.module.css";
import { IPost } from "../../../../../shared/features/posts/models/IPost";



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

    const setNewPost = (newPost: IPost) => {
        const uploadNewPost = {
            ...newPost,
            parentPost: undefined
        }

        setReplies(prevReplies => [uploadNewPost, ...prevReplies]);
        setPost(prevPost => {

            if (!prevPost) return prevPost;

            return {
                ...prevPost,
                repliesCount: prevPost.repliesCount + 1
            }
        });
        console.log("New post was added to the replies thread: !!!");


        setParentPosts(prevParentPosts => {


            const updatedParentPosts =
                prevParentPosts.map(parentPost => {
                    return {
                        ...parentPost,
                        repliesCount: parentPost.repliesCount + 1
                    }
                });

            return updatedParentPosts;
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
                                                    setLikesCount={createSingleLikeUpdater(setPost)}
                                                />

                                                <CreatePostInput
                                                    setNewPost={setNewPost}
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