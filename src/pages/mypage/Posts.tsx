import { CategoryList, RecruitList } from '@/constants'
import { useState } from 'react'

export default function Posts() {
  const [categoryId, setCategoryId] = useState(0)
  const [recruitId, setRecruitId] = useState(0)

  const selectCategory = (id: number) => {
    setCategoryId(id)
  }
  const selectRecruit = (id: number) => {
    setRecruitId(id)
  }

  return (
    <div className='flex flex-col gap-6 w-full'>
      <ul className='flex gap-10'>
        {CategoryList.map((item) => (
          <li
            key={item.id}
            className={`text-center min-w-12 text-lg font-bold hover:cursor-pointer
                    ${categoryId === item.id ? 'text-black0' : 'text-gray-500'}
                    `}
            onClick={() => selectCategory(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
      <hr />
      <ul className='flex gap-5 text-xl'>
        {RecruitList.map((item) => (
          <li
            key={item.id}
            className={`
                      hover:cursor-pointer
                      ${recruitId === item.id ? 'text-black' : 'text-gray-300'} 
                    `}
            onClick={() => selectRecruit(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
