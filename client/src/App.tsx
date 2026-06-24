
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './features/auth/layouts/SignInLayout'
import { NotAuthenticatedRoute, ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { ErrorProvider } from './features/error/contexts/ErrorContext'
import { SocketProvider } from './contexts/SocketHandlerContext'


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
        element: 
        <NotAuthenticatedRoute>
          <Outlet />
        </NotAuthenticatedRoute>,
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
        element: 
        <ProtectedRoute>
          <SocketProvider>
            <Outlet />
          </SocketProvider>
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <h1>Home Page!!!</h1>
          }
        ]
      }
    ]
  }
]);






function App() {



  return (
    <>
      <ErrorProvider>

        <RouterProvider router={router} />

      </ErrorProvider>

    </>
  )
}

export default App
