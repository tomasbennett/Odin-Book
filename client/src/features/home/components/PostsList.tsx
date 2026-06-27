import { useHomeFetch } from "../hooks/useHomeFetch";
import styles from "./PostsList.module.css";



export function PostsList() {

    const {
        sort,
        posts,
        isLoading,
        postsContainerRef
    } = useHomeFetch();

    return (
        <>
        
            <div ref={postsContainerRef} className={styles.listScrollContainer}>

                <div className={styles.posts}></div>
                <div className={styles.posts}></div>
                <div className={styles.posts}></div>
                <div className={styles.posts}></div>


            </div>
        
        </>
    )
}