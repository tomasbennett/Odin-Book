import { MouseEventHandler, useEffect } from "react";
import styles from "./SocialLink.module.css";
import { IOauthProvider } from "../../../shared/features/oauth/models/IOAuthProviders";
import { useError } from "../features/error/contexts/ErrorContext";
import { useJWTFetch } from "../hooks/useJWTFetch";
import { useAuth } from "../features/auth/contexts/AuthContext";


type ISocialLinkProps = {
    link?: string | undefined;
    username?: string | undefined;
    svg: React.ReactNode;
    bcgColor: string;
    color: string;
    height?: string;
    onDelete?: () => void;
    purpose: "link" | "cosmetics"
}

export function SocialLink({
    link,
    username,
    svg,
    bcgColor,
    color,
    height = "8rem",
    onDelete,
    purpose
}: ISocialLinkProps) {


    useEffect(() => {
        console.log("LINK: " + link);
    }, [link])


    const content = (

        <>

            <div 
                className={styles.svgContainer}>

                {svg}

            </div>

            <div className={styles.linkTextContainer}>

                <span style={{ color: color }} className={styles.username}>{username}</span>
                {!!link && <span className={styles.url}>{link}</span>}

            </div>

            {
                onDelete && (
                    <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                    }} className={styles.deleteContainer}>
                        X
                    </div>
                )
            }

        </>

    )


    return (
        <>

            {
                purpose === "link" ?

                    <a
                        style={{ backgroundColor: bcgColor, height: height }}
                        href={link} target="_blank" rel="noopener noreferrer"
                        className={`${styles.socialLink}`}>

                        {
                            content
                        }

                    </a>

                    :



                    purpose === "cosmetics" ?
                        <div
                            style={{ backgroundColor: bcgColor, height: height }}
                            className={`${styles.socialLink}`}>
                            {
                                content
                            }
                        </div>

                        :

                        null
            }



        </>
    )
}