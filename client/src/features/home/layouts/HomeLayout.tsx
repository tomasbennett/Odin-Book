import { PostsList } from "../components/PostsList";
import { AsideBar } from "../components/AsideBar";
import styles from "./HomeLayout.module.css";
import { PassiveSidebarVisual } from "../../../components/PassiveSidebarVisual";
import { useHomeFetch } from "../hooks/useHomeFetch";
import { LoadingCircle } from "../../../components/LoadingCircle";




export function HomeLayout() {


    const homeFetch = useHomeFetch();

    return (


        <>
        
            <div className={styles.outerContainer}>

                <AsideBar />

                {
                    homeFetch.isLoading ?
                        <LoadingCircle height="5rem" />

                        :

                        <PostsList {...homeFetch} />


                }



                <div className={styles.passiveImgContainer}>
                    <PassiveSidebarVisual />
                </div>  

            </div>
        
        </>


    )
}