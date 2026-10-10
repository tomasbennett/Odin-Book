import { PostsList } from "../components/PostsList";
import { AsideBar } from "../components/AsideHomeContent";
import styles from "./HomeLayout.module.css";
import { PassiveSidebarVisual } from "../../../components/PassiveSidebarVisual";
import { useHomeFetch } from "../hooks/useHomeFetch";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { CreatePostInput } from "../../posts/components/CreatePostInput";
import { useOutletContext } from "react-router-dom";
import { ISidebarCtx } from "../../../models/ISidebarCtx";
import { useEffect, useMemo } from "react";
import { IPost } from "../../../../../shared/features/posts/models/IPost";
import { useParamsErrorPopout } from "../../../hooks/useParamsErrorPopout";
import { useMediaQuery } from "react-responsive";
import { mediumScreenMaxWidth, thinScreenMaxWidth } from "../../../constants/screenDimensions";




export function HomeLayout() {


    useParamsErrorPopout({});



    const homeFetch = useHomeFetch();

    const { setSidebarContent } = useOutletContext<ISidebarCtx>();

    useEffect(() => {
        setSidebarContent(
            <AsideBar sortType={homeFetch.sort} />
        );

        return () => {
            setSidebarContent(null);
        }

    }, [homeFetch.sort, setSidebarContent]);


    const isThinScreen: boolean = useMediaQuery({ maxWidth: thinScreenMaxWidth });
    const isMediumScreen: boolean = useMediaQuery({ maxWidth: mediumScreenMaxWidth });

    const screenWidthClassName = useMemo<string>(() => {

        return isThinScreen ? styles.thinScreen : isMediumScreen ? styles.mediumScreen : styles.wideScreen;
    }, [isThinScreen, isMediumScreen]);



    return (


        <>


            <>
                <main className={`
                    ${styles.main} 
                    ${screenWidthClassName}
                    `}>

                    <CreatePostInput
                        setNewPost={(post: IPost) => {
                            homeFetch.setPosts(
                                prevPosts => [post, ...prevPosts]
                            );
                        }}

                    />
                    
                    {


                        homeFetch.isLoading ?

                            <div className={styles.loadingContainer}>

                                <LoadingCircle height="5rem" />

                            </div>

                            :

                            <PostsList {...homeFetch} />
                    }

                </main>

            </>




        </>


    )
}