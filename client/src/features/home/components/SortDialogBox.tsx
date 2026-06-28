import { VALID_SORT_OPTIONS } from "../../../../../shared/features/posts/constants";
import { ISortPostByQuery } from "../../../../../shared/features/posts/models/ISortPostsByQuery";
import { capitaliseFirstLetter } from "../../../util/capitaliseFirstLetter";
import { sortOptionsClient } from "../constants/sortOptionDetails";
import styles from "./SortDialogBox.module.css";

type ISortDialogBoxProps = {
    sortType: ISortPostByQuery
}

export function SortDialogBox({
    sortType
}: ISortDialogBoxProps) {





    return (
        <>
        
            <div className={styles.outerContainer}>

                {
                    VALID_SORT_OPTIONS.map((sortOption) => {
                        const isActiveSortOption: boolean = sortOption === sortType;

                        

                        return (
                            <div key={sortOption} className={`${styles.sortOption} ${isActiveSortOption ? styles.active : styles.inactive}`}>

                                <div className={styles.svgContainer}>
                                    {
                                        sortOptionsClient[sortOption]
                                    }
                                </div>

                                <p className={styles.text}>
                                    {
                                        capitaliseFirstLetter(sortOption)
                                    }
                                </p>

                            </div>
                        )
                    })
                }




            </div>
        
        
        
        </>
    )




}