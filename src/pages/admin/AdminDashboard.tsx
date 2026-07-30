import { UserRoundCog } from 'lucide-react'

import { useAuthStore } from '@/lib/zustand/store'

export default function AdminDashboard() {
  const userinfo = useAuthStore((state) => state.userinfo)

  return (
    <div className='w-full rounded-xl border border-gray-100 p-8'>
      <div className='flex items-center gap-6'>
        <div className='flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-50'>
          <UserRoundCog className='h-11 w-11 text-blue-600' strokeWidth={1.5} />
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-xl font-bold text-gray-900'>@관리자</span>
          <span className='text-sm text-gray-400'>{userinfo?.email}</span>
          <span className='mt-1 inline-flex w-fit items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600'>
            {userinfo?.nickname}
          </span>
        </div>
      </div>
    </div>
  )
}
