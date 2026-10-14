
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { Discord } from "../../../assets/icons/Discord";
import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { PhoneIcon } from "../../../assets/icons/PhoneIcon";
import { ModifySocialLink } from "../../../components/ModifySocialLink";
import { SocialLink } from "../../../components/SocialLink";
import { domain } from "../../../constants/EnvironmentAPI";
import { ISocialLink } from "../../profile/models/ISocialLink";
import { useDeleteSocial } from "../hooks/useDeleteSocial";
import { usePageSwitch } from "../hooks/usePageSwitch";
import { useSocialsConnect } from "../hooks/useSocialsConnect";
import styles from "./SocialInfoContainer.module.css";



type ISocialInfoContainerProps = {
    githubLink: ISocialLink;
    discordLink: ISocialLink;
    email: string | undefined;
    setHeaderInfo: React.Dispatch<React.SetStateAction<IProfileHeader | null>>
    nextPhonePage: ReturnType<typeof usePageSwitch>["nextPage"]
}

export function SocialInfoContainer({
    githubLink,
    discordLink,
    email,
    setHeaderInfo,
    nextPhonePage
}: ISocialInfoContainerProps) {

    const {
        onGithubClick,
        onGmailClick,
        // onLinkedInClick
        onDiscordClick
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

            <div className={styles.infoOuterContainer}>

                {
                    (githubLink.socialLinkExists ||
                        discordLink.socialLinkExists || email) && (

                        <div className={styles.innerContainer}>

                            <span className={styles.title}>
                                Current Social Links
                            </span>

                            <div className={styles.currentSocialLinksContainer}>

                                {
                                    githubLink.socialLinkExists && (
                                        <SocialLink
                                            purpose={"link"}
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
                                    discordLink.socialLinkExists && (
                                        <SocialLink
                                            purpose={"cosmetics"}
                                            link={discordLink.link}
                                            username={discordLink.username}
                                            svg={<Discord fill="white" />}
                                            bcgColor="#5865F2"
                                            color="white"
                                            height="6rem"
                                            onDelete={() => {
                                                onDeleteSocialLink(
                                                    "discord",
                                                    () => {
                                                        setHeaderInfo((prev) => {
                                                            if (!prev) return prev;
                                                            return {
                                                                ...prev,
                                                                discordEmail: undefined,
                                                                discordUsername: undefined
                                                            }
                                                        })
                                                    }
                                                )
                                            }}
                                        />
                                    )
                                }

                                {
                                    email && (
                                        <SocialLink
                                            purpose={"cosmetics"}
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
                            onClick={onDiscordClick} svg={<Discord />}
                            continueText={`${discordLink.socialLinkExists ? "Update Discord Connect" : "Connect Discord Account"}`} />

                        <ModifySocialLink
                            onClick={onGithubClick} svg={<Github />}
                            continueText={`${githubLink.socialLinkExists ? "Update Github Connect" : "Connect Github Account"}`} />

                    </div>

                </div>

            </div>



        </>
    )
}