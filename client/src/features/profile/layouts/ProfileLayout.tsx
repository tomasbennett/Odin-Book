import styles from "./ProfileLayout.module.css";




export function ProfileLayout({ children }: { children: React.ReactNode }) {





    return (
        <>
            <div className={styles.outerContainer}>

                <header className={styles.headerContainer}>

                </header>




                {
                    children
                }



            </div>
        </>
    );
}