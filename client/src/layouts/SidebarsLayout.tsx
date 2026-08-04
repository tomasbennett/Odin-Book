import React from "react";
import styles from "./SidebarsLayout.module.css";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { ISidebarCtx } from "../models/ISidebarCtx";
import { PassiveSidebarVisual } from "../components/PassiveSidebarVisual";
import { homePageRoute, profilePageRoute, searchPageRoute } from "../constants/routes";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { ISortPostByQuery } from "../../../shared/features/posts/models/ISortPostsByQuery";
import { HomeIcon } from "../assets/icons/HomeIcon";
import { SearchIcon } from "../assets/icons/SearchIcon";

import defUserImg from "../assets/DEFAULT_USER_IMG.png";


export function SidebarsLayout() {

    const [sidebarContent, setSidebarContent] = React.useState<React.ReactNode | null>(null);

    const ctx: ISidebarCtx = {
        setSidebarContent
    }

    const { authLevel } = useAuth();

    if (authLevel.userType !== "user") {
        return <Navigate to={homePageRoute} replace={true} />
    }

    const navLinkClassName = ({ isActive }: { 
        isActive: boolean;
    }) => {
        let baseClass: string = styles.navLink;

        if (isActive) {
            return `${baseClass} ${styles.activeLink}`;
        }

        return `${baseClass} ${styles.inActiveLink}`

    }

    return (
        <>

            <div className={styles.outerContainer}>

                {/* <AsideBar sortType={homeFetch.sort} /> */}

                <div className={styles.sidebarOuterContainer}>

                    <div className={styles.topContainer}>

                        <NavLink
                            to={homePageRoute}
                            className={({ isActive }) => {
                                return navLinkClassName({ isActive })
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

                    <div className={styles.middleContainer}>

                        {
                            sidebarContent
                        }

                    </div>

                    <div className={styles.lowerContainer}>

                        <NavLink
                            to={`${profilePageRoute}/${authLevel.userId}`}
                            className={`${styles.imgNavLinkContainer} ${navLinkClassName}`}>

                            <img src={authLevel.userProfileImgUrl ?? defUserImg} alt={`User image: ${authLevel.username}`} />

                        </NavLink>

                    </div>




                </div>

                <div className={styles.outletContainer}>

                    <Outlet context={ctx} />

                </div>



                <div className={styles.passiveImgContainer}>
                    <PassiveSidebarVisual />
                </div>

            </div>




        </>
    )
}