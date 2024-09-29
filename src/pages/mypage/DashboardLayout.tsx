import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MyPageList } from '@/constants'
import { useAuthStore } from '@/lib/zustand/store'
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const currentPath = pathname.split('/')[2]

  const { toast } = useToast()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      toast({
        title: '로그인이 필요한 페이지입니다',
      })
    }
  }, [])

  if (!isAuthenticated) return

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:p-10 h-fit bg-muted/40'>
      <div className='flex flex-col'>
        <div className='mx-auto grid w-full max-w-6xl gap-2'>
          <h1 className='text-3xl font-semibold'>마이페이지</h1>
        </div>
        <div className='flex gap-32 mt-12 mx-auto w-full max-w-6xl'>
          <nav>
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
          <Outlet />
        </div>
      </div>
    </div>
  )
}
