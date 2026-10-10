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
import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { mediumScreenMaxWidth, thinScreenMaxWidth } from "../../../constants/screenDimensions";



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



    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });

    const screenWidthClassName = useMemo<string>(() => {

        return isThinScreen ? styles.thinScreen : isMediumScreen ? styles.mediumScreen : styles.wideScreen;
    }, [isThinScreen, isMediumScreen]);


    const navLinkClassName = ({ isActive, sortType }: {
        isActive: boolean;
        sortType?: ISortPostByQuery | undefined
    }) => {
        let baseClass: string = `${styles.navLink} ${screenWidthClassName}`;

        if (isActive && (!sortType || currentSortType === sortType)) {
            return `${baseClass} ${styles.activeLink}`;
        }


        return `${baseClass} ${styles.inActiveLink}`

    }

    return (
        <>


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


        </>
    )
}