import { NavLink } from "react-router-dom";
import { IProfileSections, ProfileSections } from "../models/IProfileSections";
import styles from "./SectionsHeaders.module.css";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { profileStateQueryKey } from "../constants/profileStateQueryKey";
import { capitaliseFirstLetter } from "../../../util/capitaliseFirstLetter";


type ISectionHeadersProps = {
    sectionType: IProfileSections
}


export function SectionsHeaders({
    sectionType
}: ISectionHeadersProps) {


    return (
        <>



            {
                ProfileSections.map((section, index) => (


                    <NavLink 
                        to={`?${profileStateQueryKey}=${section}`} 
                        key={section} 
                        className={({ isActive }) => {
                        const def = styles.sectionsNavContainer;

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