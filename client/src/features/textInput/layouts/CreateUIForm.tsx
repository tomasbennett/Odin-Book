import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import styles from "./CreateUIForm.module.css";
import { useAuth } from "../../auth/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { homePageRoute } from "../../../constants/routes";

import defaultUserImg from "../../../assets/DEFAULT_USER_IMG.png";
import { FileIcon } from "../../../assets/icons/FileIcon";
import { ArrowIcon } from "../../../assets/icons/ArrowIcon";
import { useInputMessage } from "../hooks/useInputMessage";
import { IUseInputMessageParams } from "../models/IInputMessageErrors";
import { FileElementComponent } from "../components/FileElement";
import { useRef, useEffect } from "react";
import { LoadingCircle } from "../../../components/LoadingCircle";

type ICreateUIFormProps = {
    // registerText: UseFormRegisterReturn;
    // registerFile: UseFormRegisterReturn;

    // rootError?: FieldError;
    // textError?: FieldError;
    // fileError?: FieldError;

    // onSubmit: React.FormEventHandler<HTMLFormElement>;
} & IUseInputMessageParams;


export function CreateUIForm({
    // registerFile,
    // registerText,
    // onSubmit,
    // rootError,
    // textError,
    // fileError,
    parseInputFunc,
    parseResponseFunc,
    allowedFileMimeTypes,
    allowedMaxFileSize
}: ICreateUIFormProps) {

    const { authLevel } = useAuth();


    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }


    const {
        isLoading,
        errors,
        onSubmit,
        content,
        setContent,
        prepFiles,
        preppedFilePreviews,
        removeFile
    } = useInputMessage({
        parseInputFunc,
        parseResponseFunc,
        allowedFileMimeTypes,
        allowedMaxFileSize
    });

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "0px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    return (
        <>

            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}>

                {
                    (errors.root || errors.files || errors.content) && (
                        <div className={styles.errorContainer}>
                            {
                                Object.entries(errors).filter(([key, value]) => value !== undefined).map(([key, value]) => (
                                    <p key={key} className={styles.errorText}>{value}</p>
                                ))
                            }
                        </div>
                    )
                }

                <div className={styles.messageOuterContainer}>

                    <div className={styles.userProfileImgContainer}>

                        <div className={styles.userImgInnerContainer}>

                            <img src={authLevel.userProfileImgUrl ?? defaultUserImg} alt={`User profile image: ${authLevel.username}`} />

                        </div>

                    </div>

                    <div className={styles.messageInnerContainer}>

                        <div className={styles.bodyContainer}>

                            <label className={styles.textLabel}>

                                <textarea ref={textareaRef} value={content} onChange={(e) => {
                                    const textarea = e.target;

                                    setContent(textarea.value);

                                    textarea.style.height = "0px";
                                    textarea.style.height = `${textarea.scrollHeight}px`;



                                }} placeholder="Enter your message here..." className={`${styles.textInput} ${styles.inputField}`} />

                            </label>

                            <div className={styles.filesContainer}>
                                {
                                    preppedFilePreviews.map((file) => (
                                        <FileElementComponent
                                            key={file.id}
                                            fileId={file.id}
                                            removeFile={removeFile}
                                            fileDetails={file}
                                        />

                                    ))
                                }
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

                                        prepFiles(e);

                                        e.currentTarget.value = "";
                                    }} />
                                </label>

                            </div>

                            <div className={styles.submitContainer}>

                                <button 
                                    className={styles.submitBtn} 
                                    type="submit">

                                    {
                                        isLoading ?

                                            <div className={styles.loadingContainer}>
                                                <LoadingCircle height="100%" />
                                            </div>


                                            :

                                            <ArrowIcon />


                                    }


                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </form>


        </>
    )
}