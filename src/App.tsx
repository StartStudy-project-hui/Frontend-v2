// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom'

import Home from '@/pages/Home'
import Write from '@/pages/Write'
import Profile from '@/pages/mypage/Profile'
import Posts from '@/pages/mypage/Posts'
import Likes from '@/pages/mypage/Likes'
import DashboardLayout from '@/pages/mypage/DashboardLayout'
import ProfileEdit from '@/pages/mypage/profile/ProfileEdit'
import AdminDashboardLayout from '@/pages/admin/AdminDashboardLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminManage from '@/pages/admin/AdminManage'
import BoardDetail from '@/pages/board/BoardDetail'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components'
import CustomError from '@/pages/CustomError'
import BoardEdit from '@/pages/board/edit/BoardEdit'

function App() {
  const RootLayout = () => {
    return (
      <div className='max-w-[1600px]'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Toaster />
        <ScrollRestoration />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <CustomError />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/board/:boardId',
          element: <BoardDetail />,
        },
        {
          path: '/board/:boardId/edit',
          element: <BoardEdit />,
        },
        {
          path: '/write',
          element: <Write />,
        },
        {
          path: '/mypage',
          element: <DashboardLayout />,
          children: [
            {
              path: 'profile',
              element: <Profile />,
            },
            {
              path: 'profile/edit',
              element: <ProfileEdit />,
            },
            {
              path: 'posts',
              element: <Posts />,
            },
            {
              path: 'likes',
              element: <Likes />,
            },
          ],
        },
        {
          path: '/admin',
          element: <AdminDashboardLayout />,
          children: [
            {
              path: 'dashboard',
              element: <AdminDashboard />,
            },
            {
              path: 'manage',
              element: <AdminManage />,
            },
          ],
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
