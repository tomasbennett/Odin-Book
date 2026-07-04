import { useNavigate } from "react-router-dom";
import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { HollowThumbsUpIcon } from "../../../assets/icons/HollowThumbsUpIcon";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import { noErrorCtxError, knownError, unknownError } from "../../../constants/errorConstants";
import { errorPageRoute } from "../../../constants/routes";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useError } from "../../error/contexts/ErrorContext";
import styles from "./Like.module.css";

type ILikeProps<T extends ILikeableObject> = {
    likeFetchUrl: string;
    setLikeCount: React.Dispatch<React.SetStateAction<T[]>>;
} & ILikeableObject;


export function Like<T extends ILikeableObject>({
    likeFetchUrl,
    haveYouLiked,
    setLikeCount,
    likeCount,
    userId
}: ILikeProps<T>) {

    const nav = useNavigate();
    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();


    //SO DEPENDING ON THE TOGGLE SETTING WE NEED TO ADD /like OR /unlike TO THE END AND CHANGE THE FETCH FROM A POST TO A PATCH RESPECTIVELY, IF IN FUTURE WE CHANGE PATCH TO A DELETE THIS WILL AFFECT THE HANDLING BETWEEN THE TWO AFTERWARDS!!!
    //IF CLICKED WE WANT TO ASK A FEW QUESTIONS AND CHECK A FEW THINGS:
    //(1) CHANGE SOME OPTIMISTIC STATE ON THE FRONTEND, FOR UI PURPOSES AND FOR CHECKING ON IN CASE ANOTHER FETCH IS ALREADY RUNNING THE OPPOSITE,
    //      I DON'T CURRENTLY SEE A PROBLEM WITH JUST CHANGING THE FRONTEND STATE

    const onToggleLike = async () => {

        if (!errCtx) {
            nav(errorPageRoute, {
                state: {
                    error: noErrorCtxError
                }
            });
            return;
        }


        try {





        } catch (error: unknown) {

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return;

            }

            errCtx.throwError(unknownError);
            return;

        }
    }


    return (
        <>

            <div
                onClick={onToggleLike}
                className={styles.likeContainer}>

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