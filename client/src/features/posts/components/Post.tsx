import { Navigate, useNavigate } from "react-router-dom";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import styles from "./Post.module.css";
import { RepostIcon } from "../../../assets/icons/RepostIcon";
import { formatSentAtDate } from "../../../util/FormatDateMessage";
import { allowedImgTypes, allowedTextFileTypes } from "../../../../../shared/features/files/constants";
import { TextFileElement } from "../../textInput/components/TextFileElement";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import { HollowThumbsUpIcon } from "../../../assets/icons/HollowThumbsUpIcon";
import { HollowRepliesIcon } from "../../../assets/icons/HollowRepliesIcon";
import { HollowCommentIcon } from "../../../assets/icons/HollowCommentIcon";
import { Like } from "../../likes/components/Like";
import { domain } from "../../../constants/EnvironmentAPI";
import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { useAuth } from "../../auth/contexts/AuthContext";
import { createArrayLikeUpdater } from "../../likes/services/likeArrayObjects";
import { IUpdateLikeCountParams } from "../../likes/models/IUpdateLikeCountParams";
import { profilePageRoute } from "../../../constants/routes";


type IPostProps = {
    setLikesCount: (params: IUpdateLikeCountParams) => void;
} & IPost;


export function Post({
    id,
    userId,
    username,
    createdAt,
    likeCount,
    commentCount,
    repliesCount,
    userProfileImgUrl,
    title,
    parentPost,
    content,
    fileDetails,
    haveYouLiked,
    setLikesCount
}: IPostProps) {

    const nav = useNavigate();

    const onClickComment = () => {
        nav(`posts/${id}/comments`, { replace: true })
    }

    const onClickReply = () => {
        nav(`posts/${id}/replies`, { replace: true })
    }

    const onClickParentPost = () => {
        if (!parentPost) return;

        nav(`/posts/${parentPost.parentPostId}/replies`, { replace: true });
    }

    const onClickUsername = () => {
        nav(`${profilePageRoute}/${userId}`, { replace: true });

    }


    const likeFetchUrl = `${domain}/api/posts/${id}/like`;

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to="/" replace={true} />
    }


    return (
        <>

            <div className={styles.outerContainer}>

                {
                    parentPost && (
                        <>

                            <div onClick={onClickParentPost} className={styles.parentPostContainer}>
                                <div className={styles.repostIconSVGContainer}>
                                    <RepostIcon />
                                </div>

                                <p className={styles.parentPostUsername}>{parentPost.parentPostUsername}</p>
                            </div>

                        </>
                    )
                }


                <div className={styles.innerContainer}>


                    <div className={styles.upperPostContainer}>

                        <div
                            onClick={onClickUsername}
                            className={styles.leftSideUpperContainer}>

                            <div className={styles.userProfileImgContainer}>
                                <img src={userProfileImgUrl} alt="user profile" />
                            </div>

                            <div className={styles.titleUsernameContainer}>
                                <p className={styles.username}>{username}</p>

                                {
                                    title && (
                                        <div className={styles.postTitleContainer}>
                                            <p className={styles.postTitle}>{title}</p>
                                        </div>
                                    )
                                }
                            </div>


                        </div>

                        <div className={styles.rightSideUpperContainer}>
                            <p className={styles.createdAt}>{formatSentAtDate(createdAt)}</p>
                        </div>

                    </div>


                    <div className={styles.postContentContainer}>

                        {
                            content && (
                                <div className={styles.postContent}>
                                    <p className={styles.postContentText}>{content}</p>
                                </div>
                            )
                        }


                        <div className={styles.filesContainer}>

                            {
                                fileDetails && fileDetails.map((file) => {

                                    if (allowedImgTypes.includes(file.mimetype)) {
                                        return (
                                            <div key={file.id} className={styles.imgFileContainer}>
                                                <img className={styles.fileImg} src={file.publicUrl} alt={`Post Img File: ${file.name}`} />
                                            </div>
                                        )
                                    }

                                    if (allowedTextFileTypes.includes(file.mimetype)) {
                                        return (
                                            <div key={file.id} className={styles.textFileContainer}>
                                                <TextFileElement fileDetails={file} />
                                            </div>
                                        )
                                    }

                                    return null;
                                })
                            }

                        </div>

                    </div>


                    <div className={styles.lowerBtnsContainer}>

                        <div className={styles.likesContainer}>

                            <Like 
                                id={id}
                                likeCount={likeCount}
                                likeFetchUrl={likeFetchUrl}
                                haveYouLiked={haveYouLiked}
                                setLikeCount={setLikesCount}
                                // userId={authLevel.userId} 
                                />

                        </div>

                        <div onClick={onClickReply} className={styles.repliesContainer}>

                            <div className={styles.btnSVGContainer}>
                                <HollowRepliesIcon />
                            </div>
                            <p className={styles.repliesCount}>{repliesCount}</p>

                        </div>

                        <div onClick={onClickComment} className={styles.commentContainer}>

                            <div className={styles.btnSVGContainer}>
                                <HollowCommentIcon />
                            </div>
                            <p className={styles.commentCount}>{commentCount}</p>

                        </div>

                    </div>


                </div>





            </div>




        </>
    )
}