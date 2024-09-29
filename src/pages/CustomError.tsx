import { Flag, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CustomError() {
  return (
    <div className='h-screen mx-auto grid place-items-center text-center px-8'>
      <div>
        <Flag className='w-20 h-20 mx-auto' />
        <p
          color='blue-gray'
          className='mt-10 !text-3xl !leading-snug md:!text-4xl'
        >
          Error 404 <br /> 뭔가가 잘못된것같아요!
        </p>
        <p className='mt-8 mb-14 text-lg font-normal text-gray-500 mx-auto whitespace-pre-wrap'>
          걱정마세요! 금방 문제를 해결할게요. {'\n'}
          페이지를 새로고침 하거나 나중에 다시오세요~~
        </p>
        <div color='gray' className='flex justify-center px-4 w-full'>
          <button className=''>
            <Link to={'/'} className='flex gap-3 font-bold'>
              <Home />
              홈으로
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}
