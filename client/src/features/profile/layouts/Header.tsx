import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthContext";
import styles from "./Header.module.css";
import { logInPageRoute } from "../../../constants/routes";
import { IProfileHeader } from "../../../../../shared/features/profiles/models/IProfileHeader";
import { CalendarIcon } from "../../../assets/icons/Calendar";
import { EditTextIcon } from "../../../assets/icons/EditTextIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAboutUserEdit } from "../hooks/useAboutUserEdit";
import { useProfileImgChange } from "../hooks/useProfileImgChange";
import { PATCH_USER_ACCOUNT_BACKGROUND_IMG_KEY, PATCH_USER_PROFILE_IMG_KEY } from "../../../../../shared/features/users/constants";
import { LoadingCircle } from "../../../components/LoadingCircle";

import defUserProfileImg from "../../../assets/DEFAULT_USER_IMG.png"
import cubeNightSky from "../../../assets/cube-night-sky.jpg"
import { SocialLinks } from "../components/SocialLinks";
import { ThreeDots } from "../../../assets/icons/ThreeDots";
import { UserIcon } from "../../../assets/icons/UserIcon";
import { UserCogsIcon } from "../../../assets/icons/UserCogsIcon";

export function Header({
    userId: userProfileId,
    username,
    userProfileImg,
    accountBackgroundImg,
    accountCreatedAt,
    aboutUser,
    isLoading: isInitialFetchLoading,
    email,
    githubLink,
    githubUsername,
    linkedinLink,
    linkedinUsername
}: IProfileHeader & { isLoading: boolean }) {

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={logInPageRoute} replace={true} />;
    }


    const isUserProfileOwner: boolean = authLevel.userId === userProfileId;
    const isValidEmail: boolean = !!email && email.includes("@") && email.includes(".");

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


    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "0px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [textareaRef.current, aboutUserEditState]);


    // const textContainerClassName = useMemo<string>(() => {
    //     let baseClassName = styles.topTextContainer;

        



    // }, [
    //     isUserProfileOwner,
    //     isValidEmail
    // ])


    return (
        <>
            <header className={styles.outerContainer}>

                {
                    isInitialFetchLoading || isBannerLoading || isProfileImgLoading ?
                        <div className={styles.loadingContainer}>

                            {/* Hollow or animated spaces for the banner and profile picture??? */}
                            <LoadingCircle height="5rem" />

                        </div>

                        :

                        <>

                            <div className={styles.headerImgContainer}>

                                <label
                                    className={`${isUserProfileOwner && styles.isUsersInputImgContainer} ${styles.backgroundImgContainer}`}>

                                    <div className={styles.innerWrapper}>

                                        <img
                                            src={`${bannerImgPreview ?? cubeNightSky}`}
                                            alt={`Banner Image: ${authLevel.username}`} />


                                        {
                                            isUserProfileOwner && (
                                                <input
                                                    onChange={(e) => {
                                                        uploadNewBannerImg(e);
                                                    }}
                                                    type="file"
                                                    hidden
                                                    className={styles.bannerInput} />
                                            )
                                        }

                                    </div>




                                </label>

                                <label className={`${isUserProfileOwner && styles.isUsersInputImgContainer} ${styles.profileImgContainer}`}>

                                    <div className={styles.overflowHiddenCircleContainer}>

                                        <img src={`${profileImgPreview ?? defUserProfileImg}`} alt={`Profile Image: ${authLevel.username}`} />

                                        {
                                            isUserProfileOwner && (
                                                <input onChange={(e) => {
                                                    uploadNewProfileImg(e);
                                                }}
                                                    type="file" hidden className={styles.profileImgInput} />

                                            )
                                        }

                                    </div>

                                </label>

                            </div>

                            <div className={styles.textContainer}>

                                <div className={styles.topTextContainer}>

                                    <div className={styles.userTitleContainer}>
                                        
                                        <span className={styles.username}>
                                            {username}
                                        </span>

                                        <span className={styles.email}>
                                            {email}
                                        </span>

                                    </div>

                                    <div className={
                                        styles.socialsJoinedAtContainer
                                    }>
                                        
                                        {
                                            isUserProfileOwner && (
                                                <div className={styles.socialsDialogSVGContainer}>

                                                    <ThreeDots />

                                                </div>

                                            )
                                        }
                                        
                                        <div className={styles.joinedAtContainer}>

                                            <div className={styles.joinedSVGContainer}>
                                                <CalendarIcon />
                                            </div>

                                            <p className={styles.accountCreatedAt}>Joined: {accountCreatedAt.toLocaleDateString()}</p>

                                        </div>

                                        

                                    </div>


                                </div>




                                {
                                    <div
                                        className={
                                            `${(
                                                !aboutUserServer &&
                                                !isUserProfileOwner
                                            ) &&
                                            styles.emptyAboutContainer
                                            } ${styles.aboutUserContainer
                                            }`
                                        }>

                                        {
                                            aboutUserEditState ? (
                                                <div
                                                    className={styles.editAboutUserContainer}>

                                                    <textarea
                                                        className={styles.editAboutUserTextarea}
                                                        value={aboutUserDraft}
                                                        placeholder="Tell others about yourself here..."
                                                        ref={textareaRef}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setAboutUserDraft(val);

                                                            const textarea = e.target;

                                                            textarea.style.height = "0px";
                                                            textarea.style.height = `${textarea.scrollHeight}px`;



                                                        }} />

                                                    <div
                                                        className={styles.editAboutUserBtnContainer}
                                                    >

                                                        <button
                                                            className={styles.editAboutUserSaveBtn}
                                                            type="button"
                                                            onClick={() => {
                                                                patchAboutUser();

                                                            }}>
                                                            Save
                                                        </button>

                                                        <button
                                                            className={styles.editAboutUserCancelBtn}
                                                            type="button"
                                                            onClick={() => {
                                                                onCancel();
                                                            }}>
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>
                                            ) :



                                                <p
                                                    className={`${(!aboutUserServer && isUserProfileOwner) &&
                                                        styles.emptyAbout} 
                                                                    ${styles.aboutUser}`}>
                                                    {
                                                        (
                                                            !aboutUserServer &&
                                                            isUserProfileOwner
                                                        ) ?

                                                            "Tell others about yourself..."

                                                            :

                                                            aboutUserServer

                                                    }
                                                </p>



                                        }


                                        {
                                            isUserProfileOwner && (

                                                <div className={styles.stateAboutUserContainer}>

                                                    <button
                                                        disabled={isLoading}
                                                        className={styles.stateAboutUserBtn}
                                                        type="button"
                                                        onClick={() => toggleAboutUserEditState()}>

                                                        <EditTextIcon />

                                                    </button>

                                                </div>
                                            )
                                        }

                                    </div>
                                }


                                <div className={styles.socialLinksContainer}>

                                    <SocialLinks
                                        userId={userProfileId}
                                        linkedinLink={linkedinLink}
                                        linkedinUsername={linkedinUsername}
                                        githubLink={githubLink}
                                        githubUsername={githubUsername}
                                        email={email}
                                    />

                                </div>

                            </div>

                        </>
                }


            </header>
        </>
    );
}