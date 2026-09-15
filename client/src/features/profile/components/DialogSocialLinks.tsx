import { ISocialLink } from "../models/ISocialLink";
import styles from "./DialogSocialLinks.module.css";


type IDialogSocialLinksProps = {
    githubLink: ISocialLink;
    linkedinLink: ISocialLink;
    email: string | undefined;
}


export function DialogSocialLinks({
    githubLink,
    linkedinLink,
    email
}: IDialogSocialLinksProps) {



    return (
        <>

            <dialog className={styles.dialog}>

                <div className={styles.outerContainer}>

                    {
                        (githubLink.socialLinkExists ||
                            linkedinLink.socialLinkExists || email) && (

                            <div className={styles.innerContainer}>

                                <h2 className={styles.title}>
                                    Current Social Links
                                </h2>

                                <div className={styles.currentSocialLinksContainer}>



                                </div>

                            </div>

                        )

                    }


                    <div className={styles.innerContainer}>

                        <h2 className={styles.title}>
                            Modify Social Links
                        </h2>


                        <div className={styles.modifySocialLinksContainer}>



                        </div>

                    </div>




                </div>

            </dialog>




        </>
    )
}