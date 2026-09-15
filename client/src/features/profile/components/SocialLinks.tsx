import { ISocialInfo } from "../../../../../shared/features/socials/models/ISocialInfo";
import { Github } from "../../../assets/icons/Github";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import styles from "./SocialLinks.module.css";

type ISocialLinksProps = {

} & ISocialInfo;

export function SocialLinks({
    linkedinLink,
    linkedinUsername,
    githubLink,
    githubUsername
}: ISocialLinksProps) {



    return (
        <>

            <div className={styles.outerContainer}>

                {
                    linkedinLink && linkedinUsername && (
                        <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.linkedin}`}>
                            <div className={styles.svgContainer}>

                                <LinkedIn />

                            </div>

                            <div className={styles.linkTextContainer}>
                                <span className={styles.username}>{linkedinUsername}</span>
                                <span className={styles.url}>{linkedinLink}</span>
                            </div>

                        </a>
                    )
                }

                {
                    githubLink && githubUsername && (
                        <a href={githubLink} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.github}`}>
                            
                            <div className={styles.svgContainer}>
                                
                                <Github />

                            </div>
                            
                            <div className={styles.linkTextContainer}>
                                <span className={styles.username}>{githubUsername}</span>
                                <span className={styles.url}>{githubLink}</span>
                            </div>


                        </a>
                    )
                }

            </div>

        </>
    )
}