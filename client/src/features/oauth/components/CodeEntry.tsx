import { PHONE_OTP_CODE_LENGTH } from "../../../../../shared/features/oauth/constants";
import { usePhoneCodeSubmission } from "../hooks/useCodeSubmission";
import styles from "./CodeEntry.module.css";



export function CodeEntry() {

    const {
        
    } = usePhoneCodeSubmission();

    return (
        <>

            <div className={styles.innerContainer}>

                <span className={styles.title}>
                    Enter Code
                </span>

                <div className={styles.codeContainer}>

                    {
                        Array.from({ length: PHONE_OTP_CODE_LENGTH }, (_, indx) => {


                            return (
                                <label key={indx} className={styles.codeLabel}>

                                    <input
                                        className={styles.codeInput}
                                        type="text" />
                                        

                                </label>
                            )
                        })

                    }

                </div>

            </div>


        </>
    )
}