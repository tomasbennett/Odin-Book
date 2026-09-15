import styles from "./SocialLink.module.css";


type ISocialLinkProps = {
    link?: string | undefined;
    username: string;
    svg: React.ReactNode;
    bcgColor: string;
    color: string;
    height?: string;
}

export function SocialLink({
    link,
    username,
    svg,
    bcgColor,
    color,
    height = "8rem"
}: ISocialLinkProps) {



    return (
        <>

            <a
                style={{ backgroundColor: bcgColor, height: height }}
                href={link} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink}`}>
                
                <div className={styles.svgContainer}>

                    {svg}

                </div>

                <div className={styles.linkTextContainer}>

                    <span style={{ color: color }} className={styles.username}>{username}</span>
                    {!!link && <span className={styles.url}>{link}</span>}

                </div>

            </a>


        </>
    )
}