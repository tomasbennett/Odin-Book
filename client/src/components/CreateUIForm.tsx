import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import styles from "./CreateUIForm.module.css";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { homePageRoute } from "../constants/routes";

import defaultUserImg from "../assets/DEFAULT_USER_IMG.png";
import { FileIcon } from "../assets/icons/FileIcon";
import { ArrowIcon } from "../assets/icons/ArrowIcon";

type ICreateUIFormProps = {
    registerText: UseFormRegisterReturn;
    registerFile: UseFormRegisterReturn;

    rootError?: FieldError;
    textError?: FieldError;
    fileError?: FieldError;

    onSubmit: React.FormEventHandler<HTMLFormElement>;
}


export function CreateUIForm({
    registerFile,
    registerText,
    onSubmit,
    rootError,
    textError,
    fileError
}: ICreateUIFormProps) {

    const { authLevel } = useAuth();


    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }


    return (
        <>

            <form className={styles.form} onSubmit={onSubmit}>

                {
                    (rootError || fileError || textError) && (
                        <div className={styles.errorContainer}>
                            {
                                rootError && (
                                    <p className={styles.errorMessage}>{rootError.message}</p>
                                )
                            }
                            {
                                textError && (
                                    <p className={styles.errorMessage}>{textError.message}</p>
                                )
                            }
                            {
                                fileError && (
                                    <p className={styles.errorMessage}>{fileError.message}</p>
                                )
                            }
                        </div>
                    )
                }

                <div className={styles.messageOuterContainer}>

                    <div className={styles.userProfileImgContainer}>

                        <img src={authLevel.userProfileImgUrl ?? defaultUserImg} alt={`User profile image: ${authLevel.username}`} />

                    </div>

                    <div className={styles.messageInnerContainer}>

                        <div className={styles.bodyContainer}>

                            <label className={styles.textLabel}>

                                <input {...registerText} type="text" className={styles.textInput} />

                            </label>

                            <div className={styles.filesContainer}>

                            </div>


                        </div>


                        <div className={styles.lowerBtnsContainer}>

                            <div className={styles.leftSideBtnsList}>

                                <label className={`${styles.fileInput} ${styles.inputField}`}>
                                    
                                    <FileIcon />

                                    <input hidden type="file" multiple onChange={(e) => {
                                        const files = e.currentTarget.files;

                                        if (!files || files.length === 0) {
                                            return;
                                        }

                                        // prepFiles(e);

                                        e.currentTarget.value = "";
                                    }} />
                                </label>

                            </div>

                            <div className={styles.submitContainer}>

                                <button className={styles.submitBtn} type="button">

                                    <ArrowIcon />

                                </button>

                            </div>

                        </div>


                    </div>



                </div>

            </form>


        </>
    )
}