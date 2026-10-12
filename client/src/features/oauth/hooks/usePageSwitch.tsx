import { useState, useMemo } from "react";
import { DIALOG_PAGES_MAP } from "../constants/DialogPages";
import { IDialogPages } from "../models/IDialogPages";
import { ILinkLoginUrlOAuth } from "../models/ILinkLoginUrlOAuth"

type IUsePageSwitch = {
    pagesAvailable: ILinkLoginUrlOAuth;

}



export function usePageSwitch({
    pagesAvailable
}: IUsePageSwitch) {

    const [page, setPage] = useState<IDialogPages>(
        // DIALOG_PAGES_MAP[pagesAvailable][0]
        "phoneCode"
    );

    const isFirstPage: boolean = useMemo(() => {
        return page === DIALOG_PAGES_MAP[pagesAvailable][0];

    }, [page, pagesAvailable]);


    const nextPage = () => {
        setPage((prev) => {
            const indx: number = DIALOG_PAGES_MAP[pagesAvailable].indexOf(prev);

            if (indx < 0 || indx >= DIALOG_PAGES_MAP[pagesAvailable].length) {
                return DIALOG_PAGES_MAP[pagesAvailable][0];
            }

            return DIALOG_PAGES_MAP[pagesAvailable][indx + 1]

        });
    }

    const prevPage = () => {
        setPage((prev) => {
            const indx: number = DIALOG_PAGES_MAP[pagesAvailable].indexOf(prev);

            if (indx < 0 || indx === 0) {
                return DIALOG_PAGES_MAP[pagesAvailable][0];
            }

            return DIALOG_PAGES_MAP[pagesAvailable][indx - 1]

        });
    }




    return {
        page,
        isFirstPage,
        nextPage,
        prevPage
    }


}