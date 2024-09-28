import { useState } from 'react'
import { CircleUserRound, Pencil } from 'lucide-react'

import { Loader } from '@/components/index'
import { Link, useParams } from 'react-router-dom'
import { USER } from '@/constants'

export default function Page() {
  const params = useParams()

  // if (!currentUser)
  //   return (
  //     <div className='flex-center w-full h-full'>
  //       <Loader />
  //     </div>
  //   )

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
                <span className='text-2xl font-bold'>@{USER.username}</span>
                <span className='text-lg text-gray-500'>{USER.email}</span>
              </div>
              <div>
                <span className='text-xl font-bold'>{USER.nickname}</span>
              </div>
            </div>
            <Link to={'./edit'} relative='path' className='ml-auto'>
              <Pencil />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
