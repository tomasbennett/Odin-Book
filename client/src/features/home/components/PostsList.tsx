import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { Post } from "../../posts/components/Post";
import { useHomeFetch } from "../hooks/useHomeFetch";
import styles from "./PostsList.module.css";



export function PostsList() {

    const {
        sort,
        posts,
        setPosts,
        isLoading,
        postsContainerRef
    } = useHomeFetch();

    return (
        <>
        
            <div ref={postsContainerRef} className={styles.listScrollContainer}>

                {/* <div className={styles.posts}></div>
                <div className={styles.posts}></div>
                <div className={styles.posts}></div>
                <div className={styles.posts}></div> */}

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
        
        </>
    )
}