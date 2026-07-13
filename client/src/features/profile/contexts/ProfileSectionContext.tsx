import React, { createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";

export type IProfileSectionsProviderContext = Socket | null;

export const ProfileSectionsContext = createContext<IProfileSectionsProviderContext>(null);




export const ProfileSectionsProvider = ({
    children
}: { children: React.ReactNode }) => {




    return (
        <ProfileSectionsContext.Provider value={ctx}>


            {

                children

            }


        </ProfileSectionsContext.Provider>
    );
}



export function useProfileSections() {
    const profileSections = useContext(ProfileSectionsContext);

    if (!profileSections) {
        throw new Error("Profile sections data not available!!!");
    }

    return profileSections;
}