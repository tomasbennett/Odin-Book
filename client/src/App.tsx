
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './features/auth/layouts/SignInLayout'
import { NotAuthenticatedRoute, ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { accountPageRoute, conversationPageRoute, invitesPageRoute, myAccountPageRoute, newConversationPageRoute, singleConversationPageRoute } from './constants/routes'
import { ErrorProvider } from './features/error/contexts/ErrorContext'


const router = createBrowserRouter([
  {
    path: "/",
    element:
      <AuthProvider>
        <GeneralHomeLayout />
      </AuthProvider>,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "error",
        element: <ErrorPageLayout />,
      },
      {
        element: <NotAuthenticatedRoute />,
        children: [
          {
            element: <SignInLayout />,
            children: [
              {
                path: "login",
                handle: {
                  title: "Login",
                }
              },
              {
                path: "register",
                handle: {
                  title: "Register",
                }
              }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          
        ]
      }
    ]
  }
]);






function App() {



  return (
    <>
      <ErrorProvider>

        {/* <AuthProvider> */}

        <RouterProvider router={router} />

        {/* </AuthProvider> */}

      </ErrorProvider>

    </>
  )
}

export default App
