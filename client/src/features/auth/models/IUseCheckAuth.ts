import { IAuthUserInfo } from "../../../../../shared/features/auth/models/IAuthUserInfo";

export type IAuthLevel = 
    | { userType: "none"}
    | ({ userType: "user" } & IAuthUserInfo)
    | { userType: "unknown" };



export type IAuthContextType = {
    authLevel: IAuthLevel;
    setAuthLevel: (authLevel: IAuthLevel) => Promise<void>;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
}