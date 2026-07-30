import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AdminPageList } from '@/constants'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPath = pathname.split('/')[2]

  return (
    <div className='mx-auto flex max-w-5xl gap-12 px-6 py-10'>
      <div className='w-44 shrink-0'>
        <h1 className='text-xl font-bold text-gray-900'>관리자 페이지</h1>
        <nav className='mt-8'>
          <ul className='flex flex-col gap-1 text-sm'>
            {AdminPageList.map((item) => (
              <li
                key={item.id}
                className={`cursor-pointer rounded-lg px-3 py-2 font-medium transition-colors
                  ${
                    currentPath === item.value
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                onClick={() => navigate(item.value)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className='min-w-0 flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
