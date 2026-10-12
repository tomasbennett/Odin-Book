import { useForm } from "react-hook-form";
import styles from "./PhoneNumberEntry.module.css";
import { usePhoneNumberSubmission } from "../hooks/usePhoneNumberSubmission";
import { ILinkLoginUrlOAuth } from "../models/ILinkLoginUrlOAuth";



type IPhoneNumberEntryProps = {
    fetchUrl: ILinkLoginUrlOAuth;
}

export function PhoneNumberEntry({
    fetchUrl
}: IPhoneNumberEntryProps) {

    const {
        handleSubmit
    } = useForm({});

    const {
        onSubmit
    } = usePhoneNumberSubmission({
        fetchUrl
    });


    return (
        <>

            <div className={styles.innerContainer}>

                <span className={styles.title}>
                    Enter Phone Number
                </span>

                <div className={styles.telePhoneContainer}>

                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                        <label className={styles.label}>

                            <input
                                className={styles.input}
                                type="tel"
                                placeholder="Phone Number" />

                        </label>

                        <button
                            type="submit"
                            className={styles.submitButton}>
                            Submit
                        </button>

                    </form>


                </div>

            </div>

        </>
    )
}