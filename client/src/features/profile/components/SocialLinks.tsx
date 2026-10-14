import { ISocialInfo } from "../../../../../shared/features/socials/models/ISocialInfo";
import { Discord } from "../../../assets/icons/Discord";
import { Github } from "../../../assets/icons/Github";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { SocialLink } from "../../../components/SocialLink";
import styles from "./SocialLinks.module.css";

type ISocialLinksProps = {

} & ISocialInfo;

export function SocialLinks({
    discordEmail,
    discordUsername,
    githubLink,
    githubUsername
}: ISocialLinksProps) {



    return (
        <>

            <div className={styles.outerContainer}>

                {
                    (discordUsername || discordEmail) && (
                        <SocialLink
                            purpose={"cosmetics"}
                            link={discordEmail}
                            username={discordUsername}
                            svg={<Discord fill="white" />} 
                            bcgColor="#5865F2"
                            color="white"
                            />

                        
                    )
                }

                {
                    (githubLink && githubUsername) && (
                        <SocialLink
                            purpose={"link"}
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