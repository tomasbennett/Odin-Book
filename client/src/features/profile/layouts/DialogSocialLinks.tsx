import { useDialogToggle } from "../../../hooks/useDialogToggle";
import { ISocialLink } from "../models/ISocialLink";
import styles from "./DialogSocialLinks.module.css";
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { SocialsDialogContent } from "../components/SocialsDialogContent";

type IDialogSocialLinksProps = {
    githubLink: ISocialLink;
    linkedinLink: ISocialLink;
    email: string | undefined;
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    handleClickOutside: ReturnType<typeof useDialogToggle>["handleClickOutside"];
    closeDialog: ReturnType<typeof useDialogToggle>["closeDialog"];
    setHeaderInfo: React.Dispatch<React.SetStateAction<IProfileHeader | null>>
}


export function DialogSocialLinks({
    githubLink,
    linkedinLink,
    email,
    dialogRef,
    handleClickOutside,
    closeDialog,
    setHeaderInfo
}: IDialogSocialLinksProps) {

    

    return (
        <>

            <dialog
                onCancel={(event) => {
                    event.preventDefault();
                    closeDialog();
                }}
                onClick={(event) => { handleClickOutside(event) }}
                ref={dialogRef}
                className={styles.dialog}>

                {/* <ErrorProvider> */}

                    <SocialsDialogContent
                        githubLink={githubLink}
                        linkedinLink={linkedinLink}
                        email={email}
                        closeDialog={closeDialog}
                        setHeaderInfo={setHeaderInfo}
                    />
                    
                    

                {/* </ErrorProvider> */}


            </dialog>


        </>
    )
}