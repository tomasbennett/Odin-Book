import { Navigate, useNavigate } from "react-router-dom";
import { HomeIcon } from "../../../assets/icons/HomeIcon";
import styles from "./AsideHomeContent.module.css"
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



type IAsideBarProps = {
    sortType: ISortPostByQuery
}

export function AsideBar({
    sortType: currentSortType
}: IAsideBarProps) {

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }

    const navLinkClassName = ({ isActive, sortType }: { 
        isActive: boolean;
        sortType?: ISortPostByQuery | undefined
    }) => {
        let baseClass: string = styles.navLink;

        if (isActive && (!sortType || currentSortType === sortType)) {
            return `${baseClass} ${styles.activeLink}`;
        }

        // if (isActive && ) {
        //     return `${baseClass} ${styles.activeLink}`;
        // }

        return `${baseClass} ${styles.inActiveLink}`

    }

    return (
        <>
        
            {/* <div className={styles.outerContainer}>

                <div className={styles.topContainer}>

                    <NavLink 
                        to={homePageRoute} 
                        className={({ isActive }) => {
                            return navLinkClassName({isActive})
                        }}>
                        <HomeIcon />
                    </NavLink>

                </div>

                <div className={styles.searchOuterContainer}>

                    <NavLink to={searchPageRoute} className={({ isActive }) => {
                        return navLinkClassName({
                            isActive
                        })
                    }}>
                        <SearchIcon />
                    </NavLink>

                </div>

                <div className={styles.middleContainer}> */}

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"popular" satisfies ISortPostByQuery}`} className={({ isActive }) => {
                        return navLinkClassName({
                            isActive,
                            sortType: "popular"
                        })
                    }}>
                        <SolidThumbsUpIcon />
                    </NavLink>

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"newest" satisfies ISortPostByQuery}`} className={({ isActive }) => {
                        return navLinkClassName({
                            isActive,
                            sortType: "newest"
                        })
                    }}>
                        <CalendarIcon />
                    </NavLink>

                    <NavLink to={`${homePageRoute}?${sortKeyWord}=${"oldest" satisfies ISortPostByQuery}`} className={({ isActive }) => {
                        return navLinkClassName({
                            isActive,
                            sortType: "oldest"
                        })
                    }}>
                        <HourGlassIcon />
                    </NavLink>

                {/* </div>

                <div className={styles.lowerContainer}>

                    <NavLink 
                        to={`${profilePageRoute}/${authLevel.userId}`} 
                        className={`${styles.imgNavLinkContainer} ${navLinkClassName}`}>

                        <img src={authLevel.userProfileImgUrl ?? defUserImg} alt={`User image: ${authLevel.username}`} />

                    </NavLink>

                </div>




            </div> */}
        
        </>
    )
}