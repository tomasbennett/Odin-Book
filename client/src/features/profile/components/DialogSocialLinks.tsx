import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { ModifySocialLink } from "../../../components/ModifySocialLink";
import { SocialLink } from "../../../components/SocialLink";
import { useSocialsConnect } from "../../../hooks/useSocialsConnect";
import { ISocialLink } from "../models/ISocialLink";
import styles from "./DialogSocialLinks.module.css";


type IDialogSocialLinksProps = {
    githubLink: ISocialLink;
    linkedinLink: ISocialLink;
    email: string | undefined;
    dialogRef: React.RefObject<HTMLDialogElement | null>;
}


export function DialogSocialLinks({
    githubLink,
    linkedinLink,
    email,
    dialogRef
}: IDialogSocialLinksProps) {

    const {
        onGithubClick,
        onGmailClick,
        onLinkedInClick
    } = useSocialsConnect();



    return (
        <>

            <dialog ref={dialogRef} className={styles.dialog}>

                <div className={styles.outerContainer}>

                    <div className={styles.closeDialogContainer}>
                        X
                    </div>

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

            </dialog>


        </>
    )
}