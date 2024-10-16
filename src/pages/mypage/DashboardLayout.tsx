import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MyPageList } from '@/constants'
import { useAuthStore } from '@/lib/zustand/store'
import { useEffect } from 'react'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPath = pathname.split('/')[2]

  return (
    <div className='flex p-4 md:p-10 h-fit bg-muted/40'>
      <div className='flex flex-col min-w-[320px]'>
        <div className='mx-auto max-w-6xl'>
          <h1 className='text-3xl font-semibold'>마이페이지</h1>
          <div className='flex mt-12'>
            <nav className=''>
              <ul className='flex flex-col gap-4 min-w-48 text-lg text-muted-foreground'>
                {MyPageList.map((item) => (
                  <li
                    key={item.id}
                    className={`${currentPath === item.value ? 'text-xl text-black font-semibold' : ''} hover:cursor-pointer`}
                    onClick={() => navigate(item.value)}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className='mr-auto w-full max-w-3xl'>
        <Outlet />
      </div>
    </div>
  )
}
