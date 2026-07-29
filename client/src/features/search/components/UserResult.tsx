import { IUserSearchBar } from "../../../../../shared/features/users/models/ISearchBarUser";
import styles from "./UserResult.module.css";

import defUserProfileImg from "../../../assets/DEFAULT_USER_IMG.png";
import { useNavigate } from "react-router-dom";
import { profilePageRoute } from "../../../constants/routes";



export function UserResult({
    userId,
    username,
    userEmail,
    userProfileImgUrl
}: IUserSearchBar) {

    const nav = useNavigate();


    const onClickUserAccount = () => {
        nav(`${profilePageRoute}/${userId}`, {
            replace: true
        });
    }

    return (
        <>

            <div onClick={onClickUserAccount} className={styles.userResultContainer}>

                <div className={styles.userProfileImgContainer}>
                    <img
                        src={userProfileImgUrl ?? defUserProfileImg}
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