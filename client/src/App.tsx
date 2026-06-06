
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './features/auth/layouts/SignInLayout'
import { NotAuthenticatedRoute, ProtectedRoute } from './features/auth/services/ProtectedRoute'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { AboutPage } from './components/AboutPage'
import { ContactsPage } from './components/ContactsPage'


const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="about" replace />
      },
      {
        path: "error",
        element: <ErrorPageLayout />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "sign-in",
            element: <SignInLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="login" replace />,
              },
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
        element: <NotAuthenticatedRoute />,
        children: [
          {
            path: "about",
            element: <AboutPage />
          },
          {
            path: "contacts",
            element: <ContactsPage />
          }
        ]
      }
    ]
  }
]);






function App() {

  return (
    <>

      <RouterProvider router={router} />

    </>
  )
}

export default App
