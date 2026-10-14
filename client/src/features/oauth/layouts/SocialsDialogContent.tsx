

import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { BackBtnIcon } from "../../../assets/icons/BackBtn";
import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { ModifySocialLink } from "../../../components/ModifySocialLink";
import { SocialLink } from "../../../components/SocialLink";
import { domain } from "../../../constants/EnvironmentAPI";
import { useDialogToggle } from "../../../hooks/useDialogToggle";
import { useSocialsConnect } from "../hooks/useSocialsConnect";
import { useDeleteSocial } from "../hooks/useDeleteSocial";
import { ISocialLink } from "../../profile/models/ISocialLink";
import styles from "./SocialsDialogContent.module.css";
import { ILinkLoginUrlOAuth } from "../models/ILinkLoginUrlOAuth";
import { useMemo, useState } from "react";
import { IDialogPages } from "../models/IDialogPages";
import { DIALOG_PAGES_MAP } from "../constants/DialogPages";
import { PhoneNumberEntry } from "../components/PhoneNumberEntry";
import { CodeEntry } from "../components/CodeEntry";
import { SocialInfoContainer } from "../components/SocialInfoContainer";
import { usePageSwitch } from "../hooks/usePageSwitch";


type ISocialsDialogContentProps = {
    githubLink: ISocialLink;
    discordLink: ISocialLink;
    email: string | undefined;
    closeDialog: ReturnType<typeof useDialogToggle>["closeDialog"];
    setHeaderInfo: React.Dispatch<React.SetStateAction<IProfileHeader | null>>
    pagesAvailable?: ILinkLoginUrlOAuth | undefined;
}


export function SocialsDialogContent({
    githubLink,
    discordLink,
    email,
    closeDialog,
    setHeaderInfo,
    pagesAvailable = "link"
}: ISocialsDialogContentProps) {


    const {
        isFirstPage,
        page,
        nextPage,
        prevPage
    } = usePageSwitch({
        pagesAvailable
    });


    return (
        <>

            <div className={styles.outerContainer}>


                <div className={styles.headingContainer}>

                    <div className={styles.pageNavContainer}>

                        {
                            !isFirstPage && (
                                <div
                                    onClick={() => {
                                        prevPage();
                                    }}
                                    className={styles.backBtnContainer}>

                                    <BackBtnIcon />

                                </div>
                            )
                        }

                        {
                            !(pagesAvailable === "link" && isFirstPage) && (
                                <div className={styles.pageListContainer}>

                                    {
                                        Array.from({ length: DIALOG_PAGES_MAP[pagesAvailable].length }, (_, indx) => {
                                            const isActivePage: boolean =
                                                page === DIALOG_PAGES_MAP[pagesAvailable][indx];

                                            return (
                                                <div
                                                    key={DIALOG_PAGES_MAP[pagesAvailable][indx]}
                                                    className={`${styles.page} ${isActivePage ? styles.active : styles.inactive}`}>
                                                </div>
                                            )

                                        })
                                    }

                                </div>
                            )
                        }


                    </div>




                    <div
                        onClick={() => { closeDialog() }}
                        className={styles.closeDialogContainer}>
                        X
                    </div>

                </div>


                {
                    pagesAvailable === "link" ?

                            page === "social" ?

                                <SocialInfoContainer 
                                    githubLink={githubLink}
                                    email={email}
                                    discordLink={discordLink}
                                    setHeaderInfo={setHeaderInfo}
                                    nextPhonePage={nextPage}
                                />

                            :

                            page === "phoneNumber" ?

                                <PhoneNumberEntry fetchUrl={"link"} />

                            :

                            page === "phoneCode" ?

                                <CodeEntry />

                            :

                            null

                        :


                    pagesAvailable === "login" ?

                        page === "phoneNumber" ?

                            <PhoneNumberEntry fetchUrl={"login"} />

                        :

                        page === "phoneCode" ?

                            <CodeEntry />

                        :

                        null

                        :

                    null
                }






            </div>



        </>
    )
}