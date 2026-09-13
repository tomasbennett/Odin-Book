import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import styles from "./AlternateRegMethods.module.css";




export function AlternateLoginMethods() {


    const onGmailClick = () => {

    }

    const onLinkedInClick = () => {

    }

    const onGithubClick = () => {

    }


    return (
        <>

            <div className={styles.outerContainer}>

                <div className={styles.optionContainer} onClick={onGmailClick}>

                    <div className={styles.svgContainer}>

                        <Google />

                    </div>


                    <span className={styles.countinueText}>
                        Continue with Google
                    </span>

                </div>

                <div className={styles.optionContainer} onClick={onLinkedInClick}>

                    <div className={styles.svgContainer}>


                        <LinkedIn />

                    </div>


                    <span className={styles.countinueText}>
                        Continue with LinkedIn
                    </span>

                </div>


                <div className={styles.optionContainer} onClick={onGithubClick}>

                    <div className={styles.svgContainer}>

                        <Github />

                    </div>


                    <span className={styles.countinueText}>
                        Continue with Github
                    </span>

                </div>


            </div>


        </>
    )
}