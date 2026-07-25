import { Navigate, useNavigate } from "react-router-dom";
import { HomeIcon } from "../../../assets/icons/HomeIcon";
import styles from "./AsideBar.module.css";
import { homePageRoute, profilePageRoute, searchPageRoute } from "../../../constants/routes";
import { useAuth } from "../../auth/contexts/AuthContext";

import defUserImg from "../../../assets/DEFAULT_USER_IMG.png";
import { SearchIcon } from "../../../assets/icons/SearchIcon";
import { NavLink } from "react-router-dom";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { ISortPostByQuery } from "../../../../../shared/features/posts/models/ISortPostsByQuery";
import { SolidThumbsUpIcon } from "../../../assets/icons/SolidThumbsUpIcon";
import { CalendarIcon } from "../../../assets/icons/Calendar";
import { HourGlassIcon } from "../../../assets/icons/HourGlassIcon";
import React from "react";



export function AsideBar() {

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }

    const navLinkClassName = ({ isActive }: { isActive: boolean }) => {
        let baseClass: string = styles.navLink;

        if (isActive) {
            return `${baseClass} ${styles.activeLink}`
        }

        return `${baseClass} ${styles.inActiveLink}`

    }

    return (
        <>
        
            <div className={styles.outerContainer}>

                <div className={styles.topContainer}>

                    <NavLink to={homePageRoute} className={navLinkClassName}>
                        <HomeIcon />
                    </NavLink>

                </div>

                <div className={styles.searchOuterContainer}>

                    <NavLink to={searchPageRoute} className={navLinkClassName}>
                        <SearchIcon />
                    </NavLink>

                </div>

                <div className={styles.middleContainer}>

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"popular" satisfies ISortPostByQuery}`} className={navLinkClassName}>
                        <SolidThumbsUpIcon />
                    </NavLink>

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"newest" satisfies ISortPostByQuery}`} className={navLinkClassName}>
                        <CalendarIcon />
                    </NavLink>

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"oldest" satisfies ISortPostByQuery}`} className={navLinkClassName}>
                        <HourGlassIcon />
                    </NavLink>

                </div>

                <div className={styles.lowerContainer}>

                    <NavLink to={`${profilePageRoute}/${authLevel.userId}`} className={navLinkClassName}>

                        <img src={authLevel.userProfileImgUrl ?? defUserImg} alt={`User image: ${authLevel.username}`} />

                    </NavLink>

                </div>




            </div>
        
        </>
    )
}