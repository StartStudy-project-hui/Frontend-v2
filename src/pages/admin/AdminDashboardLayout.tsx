import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AdminPageList, MyPageList } from '@/constants'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPath = pathname.split('/')[2]

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:p-10 h-screen bg-muted/40'>
      <div className='flex flex-col'>
        <div className='mx-auto grid w-full max-w-6xl gap-2'>
          <h1 className='text-3xl font-semibold'>관리자 페이지</h1>
        </div>
        <div className='flex gap-16 mt-12 mx-auto w-full max-w-6xl'>
          <nav>
            <ul className='flex flex-col gap-4 min-w-48 text-lg text-muted-foreground'>
              {AdminPageList.map((item) => (
                <li
                  className={`${currentPath === item.value ? 'text-xl text-black font-semibold' : ''} hover:cursor-pointer`}
                  onClick={() => navigate(item.value)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
