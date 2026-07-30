import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useGetUserPosts } from '@/lib/react-query/queries'
import {
  CategoryList,
  ConnectionTypes,
  OrderList,
  RecruitList,
} from '@/constants'
import { BoardListItem, Pagination } from '@/components'
import { Button } from '@/components/ui/button'

export default function Posts() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [recruitId, setRecruitId] = useState(0)
  const [categoryId, setCategoryId] = useState(0)
  const [orderId, setOrderId] = useState(0)
  const [connectionTypeId, setConnectionTypeId] = useState(0)

  const {
    data: boardResponse,
    refetch: fetchUserPosts,
  } = useGetUserPosts({
    recruit: searchParams.get('recruit') || 'RECRUITING',
    category: searchParams.get('category') || 'ALL',
    order: searchParams.get('order') || '0',
    connectionType: searchParams.get('connectionType') || undefined,
    page: searchParams.get('page') || undefined,
  })

  useEffect(() => {
    history.scrollRestoration = 'auto'
    fetchUserPosts()
  }, [fetchUserPosts, searchParams])

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

    console.log('orderId', orderId)
  }

  const selectConnectionType = (id: number) => {
    const connectionType = ConnectionTypes.find((item) => item.id === id)!.value
    searchParams.set('connectionType', connectionType)
    setSearchParams(searchParams, { preventScrollReset: true })
    setConnectionTypeId(id)
  }

  const handlePageChange = (pageNum: number) => {
    searchParams.set('page', (pageNum - 1).toString())
    setSearchParams(searchParams)
  }

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900'>작성글</h2>
        <Button
          className='rounded-lg font-semibold'
          onClick={() => navigate('/write')}
        >
          글쓰기
        </Button>
      </div>

      <ul className='flex gap-6 border-b border-gray-100'>
        {CategoryList.map((item) => (
          <li
            key={item.id}
            className={`cursor-pointer border-b-2 pb-3 text-sm font-semibold transition-colors
                    ${categoryId === item.id ? 'border-blue-600 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}
                    `}
            onClick={() => selectCategory(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>

      <div className='flex items-center justify-between'>
        <ul className='flex gap-4 text-sm font-medium'>
          {RecruitList.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer transition-colors
                      ${recruitId === item.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
                    `}
              onClick={() => selectRecruit(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <select
          className='rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
          onChange={(e) => selectOrder(Number(e.target.value))}
        >
          {OrderList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div className='flex gap-4'>
        {ConnectionTypes.map((item) => (
          <label
            key={item.id}
            className='flex cursor-pointer items-center gap-1.5 text-sm text-gray-500'
          >
            <input
              type='radio'
              value={item.value}
              checked={connectionTypeId === item.id}
              onChange={() => selectConnectionType(item.id)}
              className='hidden'
            />
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full border-2
                     ${connectionTypeId === item.id ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'}`}
            >
              {connectionTypeId === item.id && (
                <span className='h-1.5 w-1.5 rounded-full bg-white' />
              )}
            </span>
            <span>{item.title}</span>
          </label>
        ))}
      </div>

      {boardResponse && (
        <>
          <ul className='flex flex-col gap-3'>
            {boardResponse.content.map((board) => (
              <li key={board.boardId}>
                <BoardListItem board={board} />
              </li>
            ))}
          </ul>
          <Pagination
            totalPages={boardResponse.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
