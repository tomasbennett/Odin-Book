import { createContext, useEffect, useState } from "react";
import React from "react";
import { domain } from "../constants/EnvironmentAPI";
import { APISuccessSchema } from "../../../shared/features/api/models/APISuccessResponse";



// type ISetAuthContext = {
//     userAuth: IAuthContext;
//     setUserAuth: React.Dispatch<React.SetStateAction<IAuthContext>>;
// };

// export const AuthContext = createContext<ISetAuthContext | null>(null);



// export const useAuth = () => {
//     const context = React.useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// }



// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [user, setUser] = useState<IAuthContext>({
//         isLoading: true,
//         authLevel: {
//             level: "GUEST",
//             mainMenuNav: "/sign-in/register",
//             mainMenuText: "Register account",
//             postPermission: false,
//             logoutPermission: false,
//             deleteBlogPermission: false,
//             commentPermission: false,
//         }
//     });


//     useEffect(() => {
//         const fetchAuthLevel = async () => {

//             const response = await fetch(
//                 `${domain}/api/auth/checkAuthLevel`,
//                 {
//                     method: "GET"
//                 }
//             )

//             if (response.status === 401) {
//                 setUser(guestAuth());
//                 return;
//             }

//             if (response.status === 403) {
//                 setUser(userAuth());
//                 return;
//             }

//             if (response.status === 200) {
//                 const data = await response.json();
//                 const adminResult = APISuccessSchema.safeParse(data);

//                 if (adminResult.success) {
//                     setUser(adminAuth());
//                     return;
//                 }
//             }

//             setUser(guestAuth());

//         };

//         fetchAuthLevel();


//     }, []);





//     const ctx: ISetAuthContext = {
//         userAuth: user,
//         setUserAuth: setUser,
//     }




//     return (
//         <AuthContext.Provider value={ctx}>
//             {children}
//         </AuthContext.Provider>
//     );
// }