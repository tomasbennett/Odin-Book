import { IUserSearchBar } from "../../../../../shared/features/users/models/ISearchBarUser";
import styles from "./UserResult.module.css";



export function UserResult({
    userId,
    username,
    userEmail,
    userProfileImgUrl
}: IUserSearchBar) {



    return (
        <>

            <div className={styles.userResultContainer}>

                <div className={styles.userProfileImgContainer}>
                    <img
                        src={userProfileImgUrl}
                        alt={`${username}'s profile picture`}
                        className={styles.userProfileImg}
                    />
                </div>

                <div className={styles.userInfoContainer}>
                    <p className={styles.username}>{username}</p>
                    {
                        userEmail && (
                            <p className={styles.userEmail}>{userEmail}</p>
                        )
                    }
                </div>

            </div>



        </>
    )
}