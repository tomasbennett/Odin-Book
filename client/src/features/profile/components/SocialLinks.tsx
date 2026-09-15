import { ISocialInfo } from "../../../../../shared/features/socials/models/ISocialInfo";
import { Github } from "../../../assets/icons/Github";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { SocialLink } from "../../../components/SocialLink";
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
                        <SocialLink
                            link={linkedinLink}
                            username={linkedinUsername}
                            svg={<LinkedIn />} 
                            bcgColor="#0077B5"
                            color="white"
                            />

                        
                    )
                }

                {
                    githubLink && githubUsername && (
                        <SocialLink
                            link={githubLink}
                            username={githubUsername}
                            svg={<Github />}
                            bcgColor="#e0e0e0"
                            color="black"
                            />
                    )
                }

            </div>

        </>
    )
}