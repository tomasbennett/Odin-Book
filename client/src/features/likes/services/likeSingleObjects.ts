import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { IUpdateLikeCountParams } from "../models/IUpdateLikeCountParams";

export function createSingleLikeUpdater<T extends ILikeableObject>(
    setState: React.Dispatch<React.SetStateAction<T | null>>
) {

    return ({
        liked,
        count
    }: IUpdateLikeCountParams) => {

        setState(prev => {
            if (prev === null) return null;

            return {
                ...prev,
                likeCount: count,
                haveYouLiked: liked,
            }

        });


    };
}