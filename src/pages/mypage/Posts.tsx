import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useGetUserPosts } from '@/lib/react-query/queries'
import {
  CategoryList,
  ConnectionTypes,
  OrderList,
  RecruitList,
} from '@/constants'
import { BoardListItem, Pagination } from '@/components'

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [recruitId, setRecruitId] = useState(0)
  const [categoryId, setCategoryId] = useState(0)
  const [orderId, setOrderId] = useState(0)
  const [connectionTypeId, setConnectionTypeId] = useState(0)

  const {
    data: boardResponse,
    isPending: isFetchingUserPosts,
    refetch: fetchUserPosts,
  } = useGetUserPosts({
    recruit: searchParams.get('recruit') || '모집중',
    category: searchParams.get('category') || '전체',
    order: searchParams.get('order') || '0',
    connectionType: searchParams.get('connectionType') || undefined,
    page: searchParams.get('page') || undefined,
  })

  useEffect(() => {
    history.scrollRestoration = 'auto'
    fetchUserPosts()
  }, [searchParams])

  const selectCategory = (id: number) => {
    const category = CategoryList.find((item) => item.id === id)!.value
    searchParams.set('category', category)
    setSearchParams(searchParams, { preventScrollReset: true })
    setCategoryId(id)
  }

  const selectRecruit = (id: number) => {
    const recurit = RecruitList.find((item) => item.id === id)!.value
    searchParams.set('recruit', recurit)
    setSearchParams(searchParams, { preventScrollReset: true })
    setRecruitId(id)
  }

  const selectOrder = (id: number) => {
    const order = OrderList.find((item) => item.id === id)!.value
    searchParams.set('order', order)
    setSearchParams(searchParams, { preventScrollReset: true })
    setOrderId(id)
  }

  const selectConnectionType = (id: number) => {
    const connectionType = ConnectionTypes.find((item) => item.id === id)!.value
    searchParams.set('connectionType', connectionType)
    setSearchParams(searchParams, { preventScrollReset: true })
    setConnectionTypeId(id)
  }

  const handldePageChange = (pageNum: number) => {
    searchParams.set('page', (pageNum - 1).toString())
    setSearchParams(searchParams)
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
      <div className='flex justify-between'>
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
        <select
          className='p-2 border'
          onChange={(e) => selectOrder(Number(e.target.value))}
        >
          {OrderList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
      <div className='flex gap-3'>
        {ConnectionTypes.map((item) => (
          <label key={item.id} className='flex items-center gap-1'>
            <input
              type='radio'
              value={item.value}
              checked={connectionTypeId === item.id}
              onChange={() => selectConnectionType(item.id)}
              className='hidden'
            />
            <span
              className={`flex items-center justify-center w-4 h-4 border-2 rounded-full cursor-pointer 
                     ${connectionTypeId === item.id ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
            >
              {connectionTypeId === item.id && (
                <span className='w-2 h-2 rounded-full bg-white' />
              )}
            </span>
            <span>{item.title}</span>
          </label>
        ))}
      </div>

      <hr className='' />
      {boardResponse && (
        <>
          <div>
            <ul className=''>
              {boardResponse.content.map((board) => (
                <li key={board.boardId} className='my-8'>
                  <BoardListItem board={board} />
                </li>
              ))}
            </ul>
          </div>
          <Pagination
            totalPages={boardResponse.totalPages}
            handlePageChange={handldePageChange}
          />
        </>
      )}
    </div>
  )
}
