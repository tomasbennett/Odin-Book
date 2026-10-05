import { Github } from "../../../assets/icons/Github";
import { Google } from "../../../assets/icons/Google";
import { LinkedIn } from "../../../assets/icons/LinkedIn";
import { ModifySocialLink } from "../../../components/ModifySocialLink";
import { domain } from "../../../constants/EnvironmentAPI";
import { useSocialsConnect } from "../../../hooks/useSocialsConnect";
import styles from "./AlternateRegMethods.module.css";




export function AlternateLoginMethods() {


    const {
        onGithubClick,
        onGmailClick,
        onLinkedInClick
    } = useSocialsConnect({
        sessionUrl: (str) => `${domain}/api/oauth/${str}/login`,
        reqOptions: {
            method: "GET",
        }
    });


    return (
        <>

            <div className={styles.outerContainer}>

                <ModifySocialLink
                    onClick={onGmailClick} svg={<Google />} continueText="Continue with Google" />

                <ModifySocialLink
                    onClick={onLinkedInClick} svg={<LinkedIn />} continueText="Continue with LinkedIn" />


                <ModifySocialLink
                    onClick={onGithubClick} svg={<Github />} continueText="Continue with Github" />


            </div>


        </>
    )
}