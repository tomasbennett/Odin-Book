import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { HollowThumbsUpIcon } from "../../../assets/icons/HollowThumbsUpIcon";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import styles from "./Like.module.css";

type ILikeProps<T extends ILikeableObject> = {
    likeFetchUrl: string;
    // hasLiked: boolean;
    // likeCount: number;
    setLikeCount: React.Dispatch<React.SetStateAction<T[]>>;
} & ILikeableObject;


export function Like<T extends ILikeableObject>({
    likeFetchUrl,
    haveYouLiked,
    setLikeCount,
    likeCount,
    userId
}: ILikeProps<T>) {




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