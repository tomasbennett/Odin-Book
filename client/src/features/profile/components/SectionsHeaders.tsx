import { NavLink } from "react-router-dom";
import { IProfileSections, ProfileSections } from "../models/IProfileSections";
import styles from "./SectionsHeaders.module.css";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { profileStateQueryKey } from "../constants/profileStateQueryKey";
import { capitaliseFirstLetter } from "../../../util/capitaliseFirstLetter";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import { thinScreenMaxWidth, mediumScreenMaxWidth, extraSmallScreenMaxWidth } from "../../../constants/screenDimensions";


type ISectionHeadersProps = {
    sectionType: IProfileSections
}


export function SectionsHeaders({
    sectionType
}: ISectionHeadersProps) {

    const isExtraSmallScreen: boolean = useMediaQuery({ maxWidth: extraSmallScreenMaxWidth });
    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });

    const screenWidthClassName = useMemo<string>(() => {

        return isExtraSmallScreen ? styles.extraSmallScreen :
            isThinScreen ? styles.thinScreen : 
            isMediumScreen ? styles.mediumScreen : 
            styles.wideScreen;
    }, [isThinScreen, isMediumScreen, isExtraSmallScreen]);


    return (
        <>



            {
                ProfileSections.map((section, index) => (


                    <NavLink
                        to={`?${profileStateQueryKey}=${section}`}
                        key={section}
                        className={({ isActive }) => {
                            const def = `${styles.sectionsNavContainer} ${screenWidthClassName}`;

                            return isActive && section === sectionType ?
                                `${def} ${styles.active}` :
                                `${def} ${styles.inactive}`;
                        }}>
                        <h3 className={styles.sectionHeader}>{capitaliseFirstLetter(section)}</h3>
                    </NavLink>
                ))
            }




        </>
    )
}