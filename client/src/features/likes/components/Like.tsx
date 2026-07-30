import { Navigate, useNavigate } from "react-router-dom";
import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { HollowThumbsUpIcon } from "../../../assets/icons/HollowThumbsUpIcon";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import { noErrorCtxError, knownError, unknownError, notExpectedFormatError, noSocketConnectionError } from "../../../constants/errorConstants";
import { errorPageRoute } from "../../../constants/routes";
import { useJWTFetch } from "../../../hooks/useJWTFetch";
import { useError } from "../../error/contexts/ErrorContext";
import styles from "./Like.module.css";
import { IJWTFetchResponses } from "../../../models/IJWTFetchResponses";
import { useEffect, useMemo, useRef } from "react";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { domain } from "../../../constants/EnvironmentAPI";
import { useAuth } from "../../auth/contexts/AuthContext";
import { LikeAPISuccessSchema } from "../../../../../shared/features/likes/models/ILikeAPISuccess";
import { ISendLike } from "../../../../../shared/features/likes/models/ISendLike";
import { useJWTSocketConnection } from "../../../hooks/useJWTSocketConnection";
import { useSocket } from "../../../contexts/SocketHandlerContext";
import { isArray } from "util";
import { IUpdateLikeCountParams } from "../models/IUpdateLikeCountParams";


//SO DEPENDING ON THE TOGGLE SETTING WE NEED TO ADD /like OR /unlike TO THE END AND CHANGE THE FETCH FROM A POST TO A PATCH RESPECTIVELY, IF IN FUTURE WE CHANGE PATCH TO A DELETE THIS WILL AFFECT THE HANDLING BETWEEN THE TWO AFTERWARDS!!!
//IF CLICKED WE WANT TO ASK A FEW QUESTIONS AND CHECK A FEW THINGS:
//(1) CHANGE SOME OPTIMISTIC STATE ON THE FRONTEND, FOR UI PURPOSES AND FOR CHECKING ON IN CASE ANOTHER FETCH IS ALREADY RUNNING THE OPPOSITE,
//      I DON'T CURRENTLY SEE A PROBLEM WITH JUST CHANGING THE FRONTEND STATE AND THEN FINDING A WAY TO SAY IF IT IS DIFFERENT IN TERMS OF THE WHOLE OPERATION WE JUST DID THEN RUN THE OTHER OPERATION???
//(2) NOW WE EITHER RUN OUR OPERATION ON THIS NEW VALUE OR WE SEE IF SOMETHING IS ALREADY RUNNING IN WHICH CASE WE JUST LEAVE
//(3) IF WE ARE RUNNING THE OPERATION WE NEED TO CHECK IF IT IS A LIKE OR UNLIKE AND THEN RUN THE APPROPRIATE FETCH, IF IT IS A LIKE WE WANT TO RUN A POST, IF IT IS AN UNLIKE WE WANT TO RUN A PATCH (OR DELETE IN FUTURE)

//(4) FINALLY IN TERMS OF FAIL SAFES, IF WE FAIL WITH AN ERROR THEN WE WANT TO GO BACK TO THE PREVIOUS STATE BEFORE WE TRIED ON THE UI
//(5) IF UNDER ANY CIRCUMSTANCE THE COMPONENT GETS UNMOUNTED THEN WE SHOULD BE OK TO STILL LET IT RUN BECAUSE STATES FOR THE UI WILL BE STALE ANYWAY WHICH IS FINE AND ERROR STATES CAN STILL RUN OK IN THIS INSTANCE TOO ON ANOTHER PAGE
//      ONE ISSUE HERE IS THAT IF WE LIKE LEAVE AND IMMEDIATELY RETURN WE MAY GET THE DATA BEFORE IT UPDATES BUT ON THE FRONTEND WE CAN STILL SEND ANOTHER LIKE IN THIS INSTANCE AND THE FETCH IN THIS CASE WILL FAIL AND NOT PROPERLY UPDATE???
//      DON'T KNOW HOW MUCH ROOM WE HAVE HERE OTHER THAN TO PREPARE FOR THAT SPECIFIC ERROR BEING SENT BACK FROM THE BACKEND BY THUS NOT UPDATING THE STATE SHOULD IT SAY: 
//      HEY, YOU'VE ALREADY LIKED (OR UNLIKED) THIS, SO DON'T UPDATE THE STATE AND JUST LEAVE IT AS IS, WHICH IS FINE BECAUSE THE FRONTEND STATE IS STILL CORRECT IN THIS INSTANCE
//      BUT IN THIS INSTANCE STILL CHECK CURRENT STATE OF THE FRONTEND AND IF IT IS DIFFERENT FROM THE BACKEND THEN RUN THE APPROPRIATE FETCH TO UPDATE IT, OTHERWISE LEAVE IT AS IS LIKE YOU WOULD DO FOR A SUCCESSFUL FETCH
// let serverHasLiked: boolean = optimisticHaveYouLiked;

// do {
//     const newOptimisticHaveYouLiked = !uiLikedRef.current;

//     const newServerResponse = await serverUpdate(newOptimisticHaveYouLiked);

//     if (!newServerResponse) {
//         return;
//     }

//     serverHasLiked = newServerResponse.serverHasLiked;

// } while (serverHasLiked !== uiLikedRef.current);

type ILikeProps<T extends ILikeableObject> = {
    likeFetchUrl: string;
    // setLikeCount: React.Dispatch<React.SetStateAction<T[]>>;
    // likeableObjState: T | T[];
    setLikeCount: (params: IUpdateLikeCountParams) => void
} & ILikeableObject;


export function Like<T extends ILikeableObject>({
    id,
    likeFetchUrl,
    haveYouLiked,
    setLikeCount,
    likeCount,
    // likeableObjState
    // userId
}: ILikeProps<T>) {

    const nav = useNavigate();
    const errCtx = useError();
    const { jwtFetchHandler } = useJWTFetch();
    const { setAuthLevel } = useAuth();
    const socket = useSocket();

    if (!errCtx) {
        return <Navigate to={errorPageRoute} state={{ error: noErrorCtxError }} replace />;
    }

    if (!socket || !socket?.id) {
        errCtx.throwError(noSocketConnectionError);
        return <Navigate to={errorPageRoute} state={{ error: noSocketConnectionError }} replace />;
    }




    const updateUI = (liked: boolean, count: number) => {
        setLikeCount({ liked, count });

        // setLikeCount(prev => {
        //     // if (Array.isArray(prev)) {
        //         return prev.map(p =>
        //             p.id === id
        //                 ? { ...p, haveYouLiked: liked, likeCount: count }
        //                 : p
        //         )

        //     // }

        //     // return { ...prev, haveYouLiked: liked, likeCount: count }



        // });
    };



    const requestRunningRef = useRef<boolean>(false);

    const uiLikedRef = useRef<boolean>(haveYouLiked);
    const uiLikesCountRef = useRef<number>(likeCount);

    useEffect(() => {
        uiLikedRef.current = haveYouLiked;
        uiLikesCountRef.current = likeCount;

    }, [haveYouLiked, likeCount]);


    const serverUpdate = async (shouldLike: boolean): Promise<{ serverHasLiked: boolean } | null> => {

        try {

            const url = shouldLike
                ? `${likeFetchUrl}/like`
                : `${likeFetchUrl}/unlike`;

            const likeFetchBody: ISendLike = {
                senderSocketId: socket.id!
            };

            const jwtFetchResponse = await jwtFetchHandler(url, {
                method: shouldLike ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(likeFetchBody)
            });


            if (jwtFetchResponse.returnType === "loginError") {

                setAuthLevel({ userType: "none" });
                errCtx.throwError(jwtFetchResponse.error);
                return null;
            }

            if (jwtFetchResponse.returnType === "fetchError") {
                //THIS IS WHERE WE SPECIFICALLY CHECK IF IT HAS ALREADY BEEN LIKED OR UNLIKED CHANGING IT FROM THE OPTIMISTIC STATE!!!

                errCtx.throwError(jwtFetchResponse.error);

                if (jwtFetchResponse.error.status === 409) return null;

                if (shouldLike) {
                    updateUI(false, uiLikesCountRef.current - 1);

                } else {
                    updateUI(true, uiLikesCountRef.current + 1);

                }


                return null;
            }

            const res = jwtFetchResponse.data;
            const resJSON = await res.json();



            const apiCustomErrorResult = APIErrorSchema.safeParse(resJSON);
            if (apiCustomErrorResult.success) {
                if (shouldLike) {
                    updateUI(false, uiLikesCountRef.current - 1);

                } else {
                    updateUI(true, uiLikesCountRef.current + 1);

                }
                errCtx.throwError(apiCustomErrorResult.data);
                return null;
            }

            const likeResult = LikeAPISuccessSchema.safeParse(resJSON);
            if (!likeResult.success) {
                if (shouldLike) {
                    updateUI(false, uiLikesCountRef.current - 1);

                } else {
                    updateUI(true, uiLikesCountRef.current + 1);

                }
                errCtx.throwError(notExpectedFormatError);
                return null;
            }

            return { serverHasLiked: shouldLike };


        } catch (error) {
            if (shouldLike) {
                updateUI(false, uiLikesCountRef.current - 1);

            } else {
                updateUI(true, uiLikesCountRef.current + 1);

            }

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return null;

            }

            errCtx.throwError(unknownError);
            return null;
        }


    }





    const onToggleLike = async () => {


        const optimisticHaveYouLiked: boolean = !uiLikedRef.current; //SO THIS IS THE VALUE THAT WE WANT IT TO BECOME AND SHOULD STAY LIKE THIS EVEN AFTER THE AWAIT OR CHANGES IN STATE!!!
        const optimisticLikeCount: number = optimisticHaveYouLiked ?
            uiLikesCountRef.current + 1 :
            uiLikesCountRef.current - 1;

        updateUI(optimisticHaveYouLiked, optimisticLikeCount);

        if (requestRunningRef.current) {
            return;
        }

        try {

            requestRunningRef.current = true;


            let serverState: boolean = uiLikedRef.current;

            uiLikedRef.current = optimisticHaveYouLiked;
            uiLikesCountRef.current = optimisticLikeCount;



            while (serverState !== uiLikedRef.current) {

                const desiredState = uiLikedRef.current;

                const result = await serverUpdate(desiredState);

                if (!result)
                    return;

                serverState = desiredState;
            }


        } catch (error: unknown) {
            if (optimisticHaveYouLiked) {
                updateUI(false, uiLikesCountRef.current - 1);

            } else {
                updateUI(true, uiLikesCountRef.current + 1);

            }

            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
                return;

            }

            errCtx.throwError(unknownError);
            return;

        } finally {

            requestRunningRef.current = false;
        }
    }


    return (
        <>

            <div
                onClick={() => {
                    onToggleLike();
                }}
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

                <p className={styles.likeCount}>
                    {
                        (likeCount > 0) && likeCount
                    }
                </p>


            </div>

        </>
    )
}