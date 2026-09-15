import styles from "./SocialLink.module.css";


type ISocialLinkProps = {
    link: string;
    username: string;
    svg: React.ReactNode;
    bcgColor: string;
    color: string;
}

export function SocialLink({
    link,
    username,
    svg,
    bcgColor,
    color
}: ISocialLinkProps) {



    return (
        <>

            <a
                style={{ backgroundColor: bcgColor }}
                href={link} target="_blank" rel="noopener noreferrer" className={`${styles.socialLink}`}>
                
                <div className={styles.svgContainer}>

                    {svg}

                </div>

                <div className={styles.linkTextContainer}>

                    <span style={{ color: color }} className={styles.username}>{username}</span>
                    <span className={styles.url}>{link}</span>

                </div>

            </a>


        </>
    )
}