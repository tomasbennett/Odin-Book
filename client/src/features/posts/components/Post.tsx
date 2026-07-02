import { useNavigate } from "react-router-dom";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import styles from "./Post.module.css";
import { RepostIcon } from "../../../assets/icons/RepostIcon";
import { formatSentAtDate } from "../../../util/FormatDateMessage";
import { allowedImgTypes, allowedTextFileTypes } from "../../../../../shared/features/files/constants";
import { TextFileElement } from "../../../components/TextFileElement";
import { CommentIcon } from "../../../assets/icons/CommentIcon";
import { RepliesIcon } from "../../../assets/icons/RepliesIcon";
import { ThumbsUpIcon } from "../../../assets/icons/ThumbsUpIcon";




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
    fileDetails
}: IPost) {

    const nav = useNavigate();

    const onLike = async () => {

    }

    const onClickComment = () => {

    }

    const onClickReply = () => {

    }

    const onClickParentPost = () => {
        if (!parentPost) return;

        nav(`/post/${parentPost.parentPostId}`, { replace: true });
    }

    const onClickUsername = () => {

        nav(`/profile/${userId}`, { replace: true });
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
                        <div className={styles.commentContainer}>
                            <div className={styles.btnSVGContainer}>
                                <CommentIcon />
                            </div>
                            <p className={styles.commentCount}>{commentCount}</p>
                        </div>

                        <div className={styles.likesContainer}>
                            <div className={styles.btnSVGContainer}>
                                <ThumbsUpIcon />
                            </div>
                            <p className={styles.likeCount}>{likeCount}</p>
                        </div>

                        <div className={styles.repliesContainer}>
                            <div className={styles.btnSVGContainer}>
                                <RepliesIcon />
                            </div>
                            <p className={styles.repliesCount}>{repliesCount}</p>
                        </div>


                    </div>


                </div>





            </div>




        </>
    )
}