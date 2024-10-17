import { UserRoundCog } from 'lucide-react'

import { useAuthStore } from '@/lib/zustand/store'

export default function AdminDashboard() {
  const userinfo = useAuthStore((state) => state.userinfo)

  return (
    <>
      <div className='w-full'>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-5'>
            <UserRoundCog className='object-cover' width={168} height={168} />
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <span className='text-2xl font-bold'>@관리자</span>
                <span className='text-lg text-gray-500'>{userinfo?.email}</span>
              </div>
              <div>
                <span className='text-xl font-bold'>{userinfo?.nickname}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
