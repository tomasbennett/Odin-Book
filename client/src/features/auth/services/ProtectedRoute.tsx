import { Outlet } from "react-router-dom";





export function ProtectedRoute() {
    // const { userAuth } = useCheckAuth();






    // if (userAuth.isLoading) {
    //     return (
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: '1 1 0' }}>
    //             <LoadingCircle height="5rem" />
    //         </div>
    //     )

    // } else if (userAuth.authLevel.logoutPermission) {
    //     return <Navigate to="/" replace />;
    //     // return <Outlet />;

    // } else {
        return <Outlet />;

    // }

}



export function NotAuthenticatedRoute() {
    // const { userAuth } = useCheckAuth();




    // if (userAuth.isLoading) {
    //     return (
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', flex: '1 1 0' }}>
    //             <LoadingCircle height="5rem" />
    //         </div>
    //     )
    // }

    return <Outlet />;
}
