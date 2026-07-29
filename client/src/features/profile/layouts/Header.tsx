import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import styles from "./Header.module.css";
import { logInPageRoute } from "../../../constants/routes";
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { CalendarIcon } from "../../../assets/icons/Calendar";
import { EditTextIcon } from "../../../assets/icons/EditTextIcon";
import { useState } from "react";
import { useAboutUserEdit } from "../hooks/useAboutUserEdit";
import { useProfileImgChange } from "../hooks/useProfileImgChange";
import { PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY, PATCH_USER_PROFILE_IMG_KEY } from "../../../../../shared/features/users/constants";
import { LoadingCircle } from "../../../components/LoadingCircle";

import defUserProfileImg from "../../../assets/DEFAULT_USER_IMG.png"


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


    const {
        aboutUserEditState,
        toggleAboutUserEditState,
        isLoading,
        patchAboutUser,
        aboutUserDraft,
        setAboutUserDraft,
        aboutUserServer,
        setAboutUserServer,
        onCancel
    } = useAboutUserEdit(aboutUser || "");

    const {
        preview: profileImgPreview,
        uploadNewImgFile: uploadNewProfileImg,
        isDefUrlLoading: isProfileImgLoading
    } = useProfileImgChange(
        PATCH_USER_PROFILE_IMG_KEY,
        userProfileImg ?? null
    );

    const {
        preview: bannerImgPreview,
        uploadNewImgFile: uploadNewBannerImg,
        isDefUrlLoading: isBannerLoading
    } = useProfileImgChange(
        PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY,
        accountBackgroundImg ?? null
    );


    return (
        <>
            <header className={styles.outerContainer}>

                {
                    isBannerLoading || isProfileImgLoading ?
                        <div className={styles.loadingContainer}>

                            {/* Hollow or animated spaces for the banner and profile picture??? */}
                            <LoadingCircle height="5rem" />

                        </div>

                        :

                        <>

                            <div className={styles.headerImgContainer}>

                                <label className={styles.backgroundImgContainer}>

                                    <img src={`${bannerImgPreview ?? defUserProfileImg}`} alt={`Banner Image: ${authLevel.username}`} />

                                    <input onChange={(e) => {
                                        uploadNewBannerImg(e);
                                    }}
                                        type="file" hidden className={styles.bannerInput} />

                                </label>

                                <label className={styles.profileImgContainer}>

                                    <img src={`${profileImgPreview ?? defUserProfileImg}`} alt={`Profile Image: ${authLevel.username}`} />

                                    <input onChange={(e) => {
                                        uploadNewProfileImg(e);
                                    }}
                                        type="file" hidden className={styles.profileImgInput} />

                                </label>

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

                                    <div className={`${(aboutUserServer && isUserProfileOwner) ? styles.emptyAboutContainer : styles.fullAboutContainer} ${styles.aboutUserContainer}`}>

                                        {
                                            aboutUserEditState ? (
                                                <div className={styles.editAboutUserContainer}>

                                                    <textarea className={styles.editAboutUserTextarea} value={aboutUserDraft} onChange={(e) => {
                                                        const val = e.target.value;
                                                        setAboutUserDraft(val);

                                                    }} />

                                                    <div className={styles.editAboutUserBtnContainer}>

                                                        <button className={styles.editAboutUserSaveBtn} type="button" onClick={() => {
                                                            patchAboutUser();

                                                        }}>
                                                            Save
                                                        </button>

                                                        <button className={styles.editAboutUserCancelBtn} type="button" onClick={() => {
                                                            onCancel();
                                                        }}>
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>
                                            ) :

                                                <p className={`${(aboutUserServer && isUserProfileOwner) ? styles.emptyAbout : styles.fullAbout} ${styles.aboutUser}`}>
                                                    {
                                                        (aboutUserServer && isUserProfileOwner) || "Tell others about yourself..."
                                                    }
                                                </p>
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
                                }




                            </div>

                        </>
                }


            </header>
        </>
    );
}