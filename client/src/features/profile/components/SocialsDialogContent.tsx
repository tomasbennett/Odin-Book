

import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { ModifySocialLink } from "../../../components/ModifySocialLink";
import { SocialLink } from "../../../components/SocialLink";
import { domain } from "../../../constants/EnvironmentAPI";
import { useDialogToggle } from "../../../hooks/useDialogToggle";
import { useSocialsConnect } from "../../../hooks/useSocialsConnect";
import { useDeleteSocial } from "../hooks/useDeleteSocial";
import { ISocialLink } from "../models/ISocialLink";
import styles from "./SocialsDialogContent.module.css";


type ISocialsDialogContentProps = {
    githubLink: ISocialLink;
    linkedinLink: ISocialLink;
    email: string | undefined;
    // dialogRef: React.RefObject<HTMLDialogElement | null>;
    // handleClickOutside: ReturnType<typeof useDialogToggle>["handleClickOutside"];
    closeDialog: ReturnType<typeof useDialogToggle>["closeDialog"];
    setHeaderInfo: React.Dispatch<React.SetStateAction<IProfileHeader | null>>
}


export function SocialsDialogContent({
    githubLink,
    linkedinLink,
    email,
    // dialogRef
    // handleClickOutside,
    closeDialog,
    setHeaderInfo


}: ISocialsDialogContentProps) {

    const {
        onGithubClick,
        onGmailClick,
        onLinkedInClick
    } = useSocialsConnect({
        sessionUrl: (str) => `${domain}/api/oauth/${str}/link`,
        reqOptions: {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }
    });


    const {
        onDeleteSocialLink
    } = useDeleteSocial();



    return (
        <>

            <div className={styles.outerContainer}>

                <div onClick={() => { closeDialog() }} className={styles.closeDialogContainer}>
                    X
                </div>


                <div className={styles.infoOuterContainer}>

                    {
                        (githubLink.socialLinkExists ||
                            linkedinLink.socialLinkExists || email) && (

                            <div className={styles.innerContainer}>

                                <span className={styles.title}>
                                    Current Social Links
                                </span>

                                <div className={styles.currentSocialLinksContainer}>

                                    {
                                        githubLink.socialLinkExists && (
                                            <SocialLink
                                                link={githubLink.link}
                                                username={githubLink.username}
                                                svg={<Github />}
                                                bcgColor="#e0e0e0"
                                                color="black"
                                                height="6rem"
                                                onDelete={() => {
                                                    onDeleteSocialLink(
                                                        "github",
                                                        () => {
                                                            setHeaderInfo((prev) => {
                                                                if (!prev) return prev;
                                                                return {
                                                                    ...prev,
                                                                    githubLink: undefined,
                                                                    githubUsername: undefined
                                                                }
                                                            })
                                                        }
                                                    )
                                                }}
                                            />
                                        )
                                    }

                                    {
                                        linkedinLink.socialLinkExists && (
                                            <SocialLink
                                                link={linkedinLink.link}
                                                username={linkedinLink.username}
                                                svg={<LinkedIn />}
                                                bcgColor="#0077B5"
                                                color="white"
                                                height="6rem"
                                            />
                                        )
                                    }

                                    {
                                        email && (
                                            <SocialLink
                                                username={email}
                                                svg={<Google />}
                                                bcgColor="white"
                                                color="black"
                                                height="6rem"
                                                onDelete={() => {
                                                    onDeleteSocialLink(
                                                        "google",
                                                        () => {
                                                            setHeaderInfo(prev => {
                                                                if (!prev) return prev;
                                                                return {
                                                                    ...prev,
                                                                    email: undefined
                                                                }

                                                            })
                                                        }
                                                    )
                                                }}
                                            />
                                        )
                                    }


                                </div>

                            </div>

                        )

                    }


                    <div className={styles.innerContainer}>

                        <span className={styles.title}>
                            Modify Social Links
                        </span>


                        <div className={styles.modifySocialLinksContainer}>

                            <ModifySocialLink
                                onClick={onGmailClick} svg={<Google />}
                                continueText={`${email ? "Update Google Connect" : "Connect Google Account"}`} />

                            <ModifySocialLink
                                onClick={onLinkedInClick} svg={<LinkedIn />}
                                continueText={`${linkedinLink.socialLinkExists ? "Update LinkedIn Connect" : "Connect LinkedIn Account"}`} />

                            <ModifySocialLink
                                onClick={onGithubClick} svg={<Github />}
                                continueText={`${githubLink.socialLinkExists ? "Update Github Connect" : "Connect Github Account"}`} />

                        </div>

                    </div>

                </div>





            </div>



        </>
    )
}