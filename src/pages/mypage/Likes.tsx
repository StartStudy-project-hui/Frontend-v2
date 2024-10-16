import { BoardListItem, Pagination } from '@/components'
import { CategoryList, OrderList, RecruitList } from '@/constants'
import { useGetLikedPosts } from '@/lib/react-query/queries'
import { BoardResponseDto } from '@/types/Dto'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [recruitId, setRecruitId] = useState(0)
  const [categoryId, setCategoryId] = useState(0)
  const [orderId, setOrderId] = useState(0)

  const {
    data: boardResponse,
    isPending: isFetchingLikedPosts,
    refetch: fetchLikedPosts,
  } = useGetLikedPosts({
    recruit: searchParams.get('recruit') || '모집중',
    category: searchParams.get('category') || '전체',
    order: searchParams.get('order') || '0',
    page: searchParams.get('page') || undefined,
  })

  useEffect(() => {
    history.scrollRestoration = 'auto'
    fetchLikedPosts()
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
