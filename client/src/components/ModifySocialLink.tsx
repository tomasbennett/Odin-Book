import styles from "./ModifySocialLink.module.css";


type IModifySocialLinkProps = {
    onClick: () => void;
    svg: React.ReactNode;
    continueText: string;
}

export function ModifySocialLink({
    onClick,
    svg,
    continueText
}: IModifySocialLinkProps) {

    return (
        <>

            <div className={styles.optionContainer} onClick={onClick}>

                <div className={styles.svgContainer}>

                    {svg}

                </div>


                <span className={styles.countinueText}>
                    {continueText}
                </span>

            </div>


        </>
    )
}