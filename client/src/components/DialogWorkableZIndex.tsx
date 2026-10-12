import styles from "./DialogWorkableZIndex.module.css";


type IDialogWorkableZIndexProps = {
    backdropClassName?: string;
    dialogClassName?: string;
}

export function DialogWorkableZIndex({
    backdropClassName,
    dialogClassName
}: IDialogWorkableZIndexProps) {

    return (
        <>

            <div className={`${styles.backdrop} ${backdropClassName}`}>

                <div className={`${styles.dialog} ${dialogClassName}`}>

                </div>

            </div>
            
        </>
    )
}