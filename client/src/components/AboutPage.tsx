import styles from "./AboutPage.module.css";
import { useMediaQuery } from "react-responsive";
import githubProfileImg from "../assets/github-profile-img.jpg";



export function AboutPage() {


    return (
        <>
            <div className={styles.outerContainer}>

                <div className={styles.aboutInnerContainer}>
                    <header className={styles.headerSection}>
                        <h1 className={styles.title}>About the Blog Project</h1>
                        <p className={styles.subtitle}>
                            Discover what makes this project unique
                        </p>
                    </header>

                    <section
                        className={`${styles.contentSection}`}>

                        <div className={styles.textContainer}>
                            <h2 className={styles.sectionTitle}>My Mission</h2>
                            <p className={styles.paragraph}>
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere voluptatum cumque molestias voluptas voluptatem. Nulla quae consequatur dolor, nisi sed, atque placeat eaque sit excepturi perferendis velit illum ad accusamus.
                            </p>
                            <p className={styles.paragraph}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi tenetur quisquam, placeat doloremque obcaecati deserunt!
                            </p>
                        </div>

                        <div className={styles.imageContainer}>
                            <img
                                src={githubProfileImg}
                                alt="Github Profile Picture"
                                className={styles.image}
                            />
                        </div>
                    </section>

                    <footer className={styles.footerSection}>
                        <h3 className={styles.footerTitle}>My Values</h3>
                        <div className={styles.valuesGrid}>
                            <div className={styles.valueBox}>
                                <h4>Quality</h4>
                                <p>I try to provide the best quality with my websites for any and all users.</p>
                            </div>
                            <div className={styles.valueBox}>
                                <h4>Trust</h4>
                                <p>
                                    I value transparency and wish to build on trust between myself and the users.
                                </p>
                            </div>
                            <div className={styles.valueBox}>
                                <h4>Innovation</h4>
                                <p>
                                    I'm always looking to better myself so please feel free to leave any criticism.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>

            </div>

        </>
    )
}