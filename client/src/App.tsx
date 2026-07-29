
import { Navigate, Outlet, RouterProvider, createBrowserRouter, replace } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { SignInLayout } from './features/auth/layouts/SignInLayout'
import { NotAuthenticatedRoute, ProtectedRoute } from './features/auth/components/ProtectedRoute'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { AuthProvider } from './features/auth/contexts/AuthContext'
import { ErrorProvider } from './features/error/contexts/ErrorContext'
import { SocketProvider } from './contexts/SocketHandlerContext'
import { HomeLayout } from './features/home/layouts/HomeLayout'
import { homePageRoute, profilePageRoute, searchPageRoute } from './constants/routes'
import { ProfileLayout } from './features/profile/layouts/ProfileLayout'
import { PostCommentsThread } from './features/commentsThread/layouts/PostCommentsThread'
import { RepliesThreadLayout } from './features/repliesThread/layouts/RepliesThreadLayout'
import { CommentRepliesThread } from './features/commentsThread/layouts/CommentRepliesThread'
import { profileStateQueryKey } from './features/profile/constants/profileStateQueryKey'
import { IProfileSections } from './features/profile/models/IProfileSections'
import { SearchUsersLayout } from './features/search/layouts/SearchUsersLayout'


const router = createBrowserRouter([
  {
    path: homePageRoute,
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
            element: <HomeLayout />
          },
          {
            path: profilePageRoute,
            children: [
              {
                index: true,
                element: <Navigate to={`${profilePageRoute}/me`} replace={true} />
              },
              {
                path: ":userId",
                element: <ProfileLayout />
              }
            ]
          },
          {
            path: "posts",
            children: [
              {
                index: true,
                element: <Navigate to={homePageRoute} replace={true} />
              },
              {
                path: ":postId",
                children: [
                  {
                    index: true,
                    element: <Navigate to={"comments"} replace={true} />
                  },
                  {
                    path: "comments",
                    element: <PostCommentsThread />
                  },
                  {
                    path: "replies",
                    element: <RepliesThreadLayout />
                  }
                ]
              }
            ]
          },
          {
            path: "comments",
            children: [
              {
                index: true,
                element: <Navigate to={`${profilePageRoute}/me?${profileStateQueryKey}=${"comments" satisfies IProfileSections}`} replace={true} />
              },
              {
                path: ":commentId",
                element: <CommentRepliesThread />
              }
            ]
          },
          {
            path: searchPageRoute,
            element: <SearchUsersLayout />
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
