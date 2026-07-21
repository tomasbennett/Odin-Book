import { ILikeableObject } from "../../../../../shared/features/likes/models/ILikeableObject";
import { IUpdateLikeCountParams } from "../models/IUpdateLikeCountParams";

export function createArrayLikeUpdater<T extends ILikeableObject>(
    id: string,
    setState: React.Dispatch<React.SetStateAction<T[]>>
) {

    return ({ 
        liked, 
        count 
    }: IUpdateLikeCountParams) => {

        setState(prev => {
            return prev.map(p => {

                if (p.id === id) {
                    return {
                        ...p,
                        haveYouLiked: liked,
                        likeCount: count
                    }
                }

                return p

            })


        });


    };
}