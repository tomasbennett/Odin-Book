import React from "react";
import styles from "./SidebarsLayout.module.css";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { ISidebarCtx } from "../models/ISidebarCtx";
import { PassiveSidebarVisual } from "../components/PassiveSidebarVisual";
import { homePageRoute, profilePageRoute, searchPageRoute } from "../constants/routes";
import { useAuth } from "../features/auth/contexts/AuthContext";
import { ISortPostByQuery } from "../../../shared/features/posts/models/ISortPostsByQuery";
import { HomeIcon } from "../assets/icons/HomeIcon";
import { SearchIcon } from "../assets/icons/SearchIcon";

import defUserImg from "../assets/DEFAULT_USER_IMG.png";
import { LogoutIcon } from "../assets/icons/LogoutIcon";
import { useError } from "../features/error/contexts/ErrorContext";
import { knownError, notExpectedFormatError, unknownError } from "../constants/errorConstants";
import { useJWTFetch } from "../hooks/useJWTFetch";
import { domain } from "../constants/EnvironmentAPI";
import { accessTokenLocalStorageKey } from "../constants/accessTokenLocalStorageKey";


export function SidebarsLayout() {

    const [sidebarContent, setSidebarContent] = React.useState<React.ReactNode | null>(null);

    const ctx: ISidebarCtx = {
        setSidebarContent
    }

    const { authLevel, setAuthLevel } = useAuth();

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


    const errCtx = useError();
    const nav = useNavigate();
    const { jwtFetchHandler } = useJWTFetch();


    const [isLoading, setIsLoading] = React.useState<boolean>(false);


    const onLogoutClick = async () => {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);

            const res = await jwtFetchHandler(`${domain}/api/sign-in/logout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });


            if (res.returnType === "fetchError") {
                errCtx.throwError(res.error);
                return;
            }

            if (res.returnType === "loginError") {
                setAuthLevel({ userType: "none" });
                errCtx.throwError(res.error);
                return;
            }

            const response = res.data;

            if (response.status === 204) {
                setAuthLevel({ userType: "none" });
                localStorage.removeItem(accessTokenLocalStorageKey);
                return;
            }

            errCtx.throwError(notExpectedFormatError);
            return


        } catch (error: unknown) {
            if (error instanceof Error) {
                errCtx.throwError(knownError(error));
            }
            errCtx.throwError(unknownError);

        } finally {
            setIsLoading(false);

        }

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

                        <div 
                            onClick={onLogoutClick} 
                            className={`${styles.logOutContainer}`}>

                            <LogoutIcon />

                        </div>

                        <div className={styles.userImgContainer}>

                            <NavLink
                                to={`${profilePageRoute}/${authLevel.userId}`}
                                className={`${styles.imgNavLinkContainer} ${navLinkClassName}`}>

                                <img src={authLevel.userProfileImgUrl ?? defUserImg} alt={`User image: ${authLevel.username}`} />

                            </NavLink>

                        </div>


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