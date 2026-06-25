//SO I WANT TO FETCH POST INFORMATION HERE FROM THE URL OBJECT OF MOST LIKED, NEWEST OR OLDEST
//AFTER THAT I WANT TO MAKE IT SCROLL BASED SO THAT YOU FETCH MORE WHEN SCROLLING DOWN

import { useSearchParams } from "react-router-dom";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { ISortPostByQuery, SortPostByQuerySchema } from "../../../../../shared/features/posts/models/ISortPostsByQuery";
import { useMemo } from "react";

export function useHomeFetch() {
    const [searchParams] = useSearchParams();

    const rawSort = searchParams.get(sortKeyWord);

    const sort: ISortPostByQuery = useMemo<ISortPostByQuery>(() => {

        const sortResult = SortPostByQuerySchema.safeParse(rawSort);
        
        return sortResult.success ? sortResult.data : "newest";


    }, [rawSort]);


}