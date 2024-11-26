import { Link } from 'react-router-dom'
import { CircleUserRound, Pencil } from 'lucide-react'

import { useAuthStore } from '@/lib/zustand/store'

export default function Page() {
  const userinfo = useAuthStore((state) => state.userinfo)

  return (
    <>
      <div className='w-full'>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-5'>
            <CircleUserRound
              className='rounded-full object-cover'
              width={168}
              height={168}
            />
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <span className='text-2xl font-bold'>
                  @{userinfo?.username}
                </span>
                <span className='text-lg text-gray-500'>{userinfo?.email}</span>
              </div>
              <div>
                <span className='text-xl font-bold'>{userinfo?.nickname} | {userinfo?.socialType}</span>
              </div>
            </div>
            <Link
              className='ml-auto'
              to={'./edit'}
              relative='path'
              state={userinfo}
            >
              <Pencil />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
