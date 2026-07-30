import { Navigate, useNavigate } from 'react-router-dom';
import { COMMENT_IMG_GIF_KEY } from '../../../../../shared/features/comments/constants';
import { IComment } from '../../../../../shared/features/comments/models/IComment';
import { formatSentAtDate } from '../../../util/FormatDateMessage';
import styles from './Comment.module.css';
import { useError } from '../../error/contexts/ErrorContext';
import { errorPageRoute, homePageRoute } from '../../../constants/routes';
import { knownError, noErrorCtxError, unknownError } from '../../../constants/errorConstants';
import { useJWTFetch } from '../../../hooks/useJWTFetch';
import { SolidCommentIcon } from '../../../assets/icons/SolidCommentIcon';
import { HollowThumbsUpIcon } from '../../../assets/icons/HollowThumbsUpIcon';
import { SolidThumbsUpIcon } from '../../../assets/icons/SolidThumbsUpIcon';
import { HollowCommentIcon } from '../../../assets/icons/HollowCommentIcon';
import { Like } from '../../likes/components/Like';
import { domain } from '../../../constants/EnvironmentAPI';
import { ILikeableObject } from '../../../../../shared/features/likes/models/ILikeableObject';
import { useAuth } from '../../auth/contexts/AuthContext';
import { IUpdateLikeCountParams } from '../../likes/models/IUpdateLikeCountParams';



type ICommentProps = {
    setLikeCount: (params: IUpdateLikeCountParams) => void;
} & IComment;


export function Comment({
    id,
    postId,
    userId,
    username,
    createdAt,
    likeCount,
    commentCount,
    userProfileImgUrl,
    parentCommentId,
    text,
    [COMMENT_IMG_GIF_KEY]: imgOrGifFileDetails,
    haveYouLiked,
    setLikeCount
}: ICommentProps) {

    const nav = useNavigate();


    const onClickComments = () => {
        nav(`comments/${id}`, { replace: true });
    }

    const likeFetchUrl = `${domain}/api/comments/${id}/like`;

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }


    return (
        <>

            <div className={styles.outerContainer}>

                <div className={styles.leftImgContainer}>

                    <div className={styles.imgContainer}>
                        <img src={`${userProfileImgUrl}`} alt={`User image ${username}`} />
                    </div>

                </div>

                <div className={styles.rightContentContainer}>

                    <div className={styles.usernameAndDateContainer}>
                        <p className={styles.username}>{username}</p>
                        <p className={styles.separationBar}>|</p>
                        <p className={styles.createdAt}>{formatSentAtDate(createdAt)}</p>
                    </div>

                    <div className={styles.contentContainer}>

                        <div className={styles.textContentContainer}>
                            {
                                text
                            }
                        </div>

                        {
                            imgOrGifFileDetails && (
                                <div className={styles.imgOrGifContainer}>
                                    <img src={`${imgOrGifFileDetails.publicUrl}`} alt={`Comment image or gif: ${imgOrGifFileDetails.name}`} />
                                </div>
                            )
                        }

                    </div>

                    <div className={styles.likeReplyContainer}>


                        <div className={styles.likesContainer}>
                            <Like
                                id={id}
                                likeCount={likeCount}
                                haveYouLiked={haveYouLiked}
                                likeFetchUrl={likeFetchUrl}
                                setLikeCount={setLikeCount}
                            // userId={authLevel.userId} 
                            />
                        </div>


                        <div
                            onClick={onClickComments}
                            className={styles.repliesContainer}>

                            <div className={`${styles.btnSVGContainer} ${styles.repliesSVGContainer}`}>
                                <HollowCommentIcon />
                            </div>


                            <p className={styles.commentCount}>
                                {
                                    (commentCount > 0) && commentCount
                                }
                            </p>

                        </div>

                    </div>


                </div>




            </div>

        </>
    )


}