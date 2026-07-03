import { HollowThumbsUpIcon } from "../../../assets/icons/HollowThumbsUpIcon";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import styles from "./Like.module.css";

type ILikeProps = {
    likeFetchUrl: string;
    hasLiked: boolean;
    likeCount: number;
}


export function Like({
    likeFetchUrl,
    hasLiked: haveYouLiked,
    likeCount
}: ILikeProps) {




    return (
        <>

            <div className={styles.likeContainer}>

                <div className={
                    `${haveYouLiked ? styles.liked : styles.notLiked} ${styles.likeSVGContainer}`
                }>
                    {
                        haveYouLiked ? (
                            <SolidThumbsUpIcon />
                        ) : (
                            <HollowThumbsUpIcon />
                        )
                    }
                </div>

                {
                    likeCount > 0 && (
                        <p className={styles.likeCount}>{likeCount}</p>
                    )
                }

            </div>

        </>
    )
}