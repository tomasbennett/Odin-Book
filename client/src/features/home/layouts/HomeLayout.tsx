import { PostsList } from "../components/PostsList";
import { AsideBar } from "../components/AsideHomeContent";
import styles from "./HomeLayout.module.css";
import { PassiveSidebarVisual } from "../../../components/PassiveSidebarVisual";
import { useHomeFetch } from "../hooks/useHomeFetch";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { CreatePostInput } from "../../posts/components/CreatePostInput";
import { useOutletContext } from "react-router-dom";
import { ISidebarCtx } from "../../../models/ISidebarCtx";
import { useEffect } from "react";




export function HomeLayout() {


    const homeFetch = useHomeFetch();

    const { setSidebarContent } = useOutletContext<ISidebarCtx>();

    useEffect(() => {
        setSidebarContent(
            <AsideBar sortType={homeFetch.sort} />
        );

        return () => {
            setSidebarContent(null);
        }

    }, [homeFetch.sort, setSidebarContent])

    return (


        <>
        
            {/* <div className={styles.outerContainer}>

                <AsideBar sortType={homeFetch.sort} /> */}

                {
                    homeFetch.isLoading ?
                        <LoadingCircle height="5rem" />

                        :

                        <>
                            <main className={styles.main}>
                                
                                <CreatePostInput 
                                    setPosts={homeFetch.setPosts}
                                    
                                />

                                <PostsList {...homeFetch} />

                            </main>
                        
                        </>


                }



                {/* <div className={styles.passiveImgContainer}>
                    <PassiveSidebarVisual />
                </div>  

            </div> */}
        
        </>


    )
}