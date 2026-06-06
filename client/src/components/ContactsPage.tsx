import styles from "./ContactsPage.module.css";

export function ContactsPage() {

    return (
        <div className={styles.outerContainer}>
            
            <div className={styles.innerWrapper}>
                <h1 className={styles.title}>Contact Me</h1>
                <p className={styles.subtitle}>
                    I’d love to hear from you! Whether you have a question about the project 
                    or just want to say hi — here’s how to reach me:
                </p>

                <div className={styles.contactDetails}>
                    <div className={styles.contactItem}>
                        <h3>Name</h3>
                        <p>Tomas Bennett</p>
                    </div>

                    <div className={styles.contactItem}>
                        <h3>Email</h3>
                        <a href="mailto:tjs.bennett@gmail.com">tjs.bennett@gmail.com</a>
                    </div>

                    <div className={styles.contactItem}>
                        <h3>Phone</h3>
                        <a href="tel:+447985798899">+44 7985 798899</a>
                    </div>

                    <div className={styles.contactItem}>
                        <h3>LinkedIn</h3>
                        <a
                            href="https://www.linkedin.com/in/tomasbennett/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            linkedin.com/in/tomasbennett/
                        </a>
                    </div>

                    <div className={styles.contactItem}>
                        <h3>GitHub</h3>
                        <a
                            href="https://github.com/tomasbennett"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            github.com/tomasbennett
                        </a>
                    </div>
                </div>
            </div>

        </div>

    );
}
