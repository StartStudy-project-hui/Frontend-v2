import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import {
  ScrollRestoration,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { useAuthStore } from '@/lib/zustand/store'
import { useGetPosts } from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'
import { CategoryList, ConnectionTypes, OrderList } from '@/constants'
import { Button } from '@/components/ui/button'
import { BoardListItem, Pagination } from '@/components'

export default function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [categoryId, setCategoryId] = useState(0)
  const [orderId, setOrderId] = useState(0)
  const [connectionTypeId, setConnectionTypeId] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  const {
    data: boardResponse,
    refetch,
  } = useGetPosts({
    title: searchParams.get('title') || undefined,
    category: searchParams.get('category') || 'ALL',
    order: searchParams.get('order') || '0',
    connectionType: searchParams.get('connectionType') || undefined,
    page: searchParams.get('page') || undefined,
  })

  useEffect(() => {
    history.scrollRestoration = 'auto'
    refetch()
  }, [refetch, searchParams])

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchKeyword) {
      searchParams.set('title', searchKeyword)
    } else {
      searchParams.set('title', '')
    }
    setSearchParams(searchParams, { preventScrollReset: true })
  }

  const selectCategory = (id: number) => {
    const category = CategoryList.find((item) => item.id === id)!.value
    searchParams.set('category', category)
    setSearchParams(searchParams, { preventScrollReset: true })
    setCategoryId(id)
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

  const handlePageChange = (pageNum: number) => {
    searchParams.set('page', (pageNum - 1).toString())
    setSearchParams(searchParams)
  }

  const handleWrite = () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인이 필요한 기능입니다',
      })
      return
    }
    navigate('/write')
  }

  return (
    <div>
      <ScrollRestoration />
      <section className='px-6 pt-8'>
        <div className='mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-white sm:px-10'>
          <p className='text-2xl font-semibold sm:text-3xl'>
            프로젝트 팀원을 모집해보세요
          </p>
          <p className='mt-2 text-sm text-gray-300 sm:text-base'>
            협업을 통한 경험 노하우 쌓기!
          </p>
        </div>
      </section>
      <section className='mx-auto max-w-5xl px-6 py-10'>
        <ul className='flex gap-6 border-b border-gray-100'>
          {CategoryList.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer border-b-2 pb-3 text-base font-semibold transition-colors
                    ${categoryId === item.id ? 'border-blue-600 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}
                    `}
              onClick={() => selectCategory(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <form className='mt-6 flex items-center gap-3' onSubmit={handleSearch}>
          <div className='relative flex w-full items-center'>
            <Search className='absolute left-3.5 h-4 w-4 text-gray-400' />
            <input
              className='w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
              placeholder='팀프로젝트, 코테, 스터디를 입력해보세요!'
              onChange={onSearchInputChange}
            />
          </div>
          <Button
            className='h-full whitespace-nowrap rounded-lg px-6 py-3 font-semibold'
            type='submit'
          >
            검색
          </Button>
        </form>
        <div className='mt-8 flex items-center justify-between'>
          <ul className='flex gap-4 text-sm font-medium'>
            {OrderList.map((item) => (
              <li
                key={item.id}
                className={`cursor-pointer transition-colors
                      ${orderId === item.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
                    `}
                onClick={() => selectOrder(item.id)}
              >
                {item.title}
              </li>
            ))}
          </ul>
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
        </div>
        <div className='mt-6 flex justify-end'>
          <Button
            className='rounded-lg px-5 font-semibold'
            onClick={handleWrite}
          >
            글쓰기
          </Button>
        </div>
        {boardResponse && (
          <>
            <ul className='mt-6 flex flex-col gap-3'>
              {boardResponse.content.map((board) => (
                <li key={board.boardId}>
                  <BoardListItem board={board} />
                </li>
              ))}
            </ul>
            <div className='mt-8'>
              <Pagination
                totalPages={boardResponse.totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
