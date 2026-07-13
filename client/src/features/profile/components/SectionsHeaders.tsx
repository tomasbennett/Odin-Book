import { NavLink } from "react-router-dom";
import { ProfileSections } from "../models/IProfileSections";
import styles from "./SectionsHeaders.module.css";
import { sortKeyWord } from "../../../../../shared/features/posts/constants";
import { profileStateQueryKey } from "../constants/profileStateQueryKey";



export function SectionsHeaders() {


    return (
        <>

            <div className={styles.outerContainer}>

                {
                    ProfileSections.map((section, index) => (





                        <NavLink to={`?${profileStateQueryKey}=${section}`} key={section} className={({isActive}) => {
                            const def = styles.sectionsNavContainer;

                            return isActive ? 
                                `${def} ${styles.active}` : 
                                `${def} ${styles.inactive}`;
                        }}>
                            <h3 className={styles.sectionHeader}>{section}</h3>
                        </NavLink>
                    ))
                }



            </div>
        
        
        </>
    )
}