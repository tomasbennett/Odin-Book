import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import styles from "./Header.module.css";
import { logInPageRoute } from "../../../constants/routes";
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { CalendarIcon } from "../../../assets/icons/Calendar";
import { EditTextIcon } from "../../../assets/icons/EditTextIcon";
import { useState } from "react";
import { useAboutUserEdit } from "../hooks/useAboutUserEdit";




export function Header({
    userId: userProfileId,
    username,
    userProfileImg,
    accountBackgroundImg,
    accountCreatedAt,
    aboutUser,
}: IProfileHeader) {

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={logInPageRoute} replace={true} />;
    }


    const isUserProfileOwner: boolean = authLevel.userId === userProfileId;


    const { aboutUserEditState, toggleAboutUserEditState, isLoading } = useAboutUserEdit(aboutUser || "");


    return (
        <>
            <div className={styles.outerContainer}>

                <div className={styles.headerImgContainer}>

                    <div className={styles.backgroundImgContainer}>

                        <img src="" alt="" />

                    </div>

                    <div className={styles.profileImgContainer}>

                        <img src="" alt="" />

                    </div>

                </div>

                <div className={styles.textContainer}>

                    <h3 className={styles.username}>{username}</h3>

                    <div className={styles.joinedAtContainer}>

                        <div className={styles.joinedSVGContainer}>
                            <CalendarIcon />
                        </div>

                        <p className={styles.accountCreatedAt}>Joined {accountCreatedAt.toLocaleDateString()}</p>

                    </div>



                    {
                        aboutUser && (
                            <div className={styles.aboutUserContainer}>

                                {
                                    aboutUserEditState ? (
                                        <div className={styles.editAboutUserContainer}>

                                            <textarea className={styles.editAboutUserTextarea} value={aboutUser} onChange={(e) => {

                                            }} />

                                            <div className={styles.editAboutUserBtnContainer}>

                                                <button className={styles.editAboutUserSaveBtn} type="button" onClick={() => {}}>
                                                    Save
                                                </button>

                                                <button className={styles.editAboutUserCancelBtn} type="button" onClick={() => {}}>
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>
                                    ) : (
                                        <p className={styles.aboutUser}>
                                            {
                                                aboutUser
                                            }
                                        </p>
                                    )
                                }


                                {
                                    isUserProfileOwner && (

                                        <div className={styles.stateAboutUserContainer}>

                                            <button disabled={isLoading} className={styles.stateAboutUserBtn} type="button" onClick={() => toggleAboutUserEditState()}>

                                                <EditTextIcon />

                                            </button>

                                        </div>
                                    )
                                }

                            </div>

                        )
                    }




                </div>


            </div>
        </>
    );
}