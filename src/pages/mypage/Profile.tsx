import { Link } from 'react-router-dom'
import { CircleUserRound, Pencil } from 'lucide-react'

import { useAuthStore } from '@/lib/zustand/store'

export default function Page() {
  const userinfo = useAuthStore((state) => state.userinfo)
  return (
    <div className='w-full rounded-xl border border-gray-100 p-8'>
      <div className='flex items-center gap-6'>
        <CircleUserRound
          className='shrink-0 rounded-full text-gray-300'
          width={96}
          height={96}
          strokeWidth={1}
        />
        <div className='flex flex-col gap-2'>
          <span className='text-xl font-bold text-gray-900'>
            @{userinfo?.username}
          </span>
          <span className='text-sm text-gray-400'>{userinfo?.email}</span>
          <span className='mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600'>
            {userinfo?.nickname}
            <span className='text-gray-300'>·</span>
            {userinfo?.socialType}
          </span>
        </div>
        <Link
          className='ml-auto shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700'
          to={'./edit'}
          relative='path'
          state={userinfo}
        >
          <Pencil className='h-5 w-5' />
        </Link>
      </div>
    </div>
  )
}
