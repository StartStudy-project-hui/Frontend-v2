import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { CategoryList, OrderList } from '@/constants'
import { Button } from '@/components/ui'
import { BoardListItem, Pagination } from '@/components'
import {
  ScrollRestoration,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { createMainlistConfig } from '@/lib/axios/AxiosModule'
import { BoardResponseDto } from '@/types/Dto'
import axios from 'axios'
import { useAuthStore } from '@/lib/zustand/store'

export default function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast } = useToast()
  const authenticated = useAuthStore((state) => state.isAuthenticated)

  const [boardResponse, setBoardResponse] = useState<BoardResponseDto>()
  const [categoryId, setCategoryId] = useState(0)
  const [orderId, setOrderId] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')

  useEffect(() => {
    history.scrollRestoration = 'auto'
    getPosts()
  }, [searchParams])

  const getPosts = async () => {
    try {
      const config = createMainlistConfig({
        title: searchParams.get('title') || undefined,
        category: searchParams.get('category') || '전체',
        order: searchParams.get('order') || '0',
        page: searchParams.get('page') || undefined,
      })
      const res = await axios(config)
      setBoardResponse(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchKeyword) {
      searchParams.set('title', searchKeyword)
      setSearchParams(searchParams, { preventScrollReset: true })
    }
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

  const handldePageChange = (pageNum: number) => {
    searchParams.set('page', (pageNum - 1).toString())
    setSearchParams(searchParams)
  }

  const handleWrite = () => {
    if (!authenticated) {
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
      <section
        onClick={() => {
          toast({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 10, 2023 at 5:57 PM',
          })
        }}
      >
        <div className='bg-black bg-opacity-90'>
          <div className='pl-32 py-8 text-white'>
            <p>프로젝트 팀원을 모집해보세요.</p>
            <p>클릭한번에 ...</p>
          </div>
        </div>
      </section>
      <section className='pl-32 pr-48 pt-5 pb-24'>
        <ul className='flex gap-5'>
          {CategoryList.map((item) => (
            <li
              key={item.id}
              className={`text-center min-w-12 border-b-2 text-lg font-bold hover:cursor-pointer
                    ${categoryId === item.id ? 'text-black border-blue-500' : 'text-gray-500'}
                    `}
              onClick={() => selectCategory(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <form className='flex items-center gap-3 mt-5' onSubmit={handleSearch}>
          <div className='relative flex items-center w-full'>
            <Search className='absolute left-2' />
            <input
              className='pl-10 py-6 w-full border'
              placeholder='팀프로젝트, 코테, 스터디를 입력해보세요!'
              onChange={onSearchInputChange}
            />
          </div>
          <Button
            className='h-full px-10 py-6 font-bold whitespace-nowrap'
            type='submit'
          >
            검색
          </Button>
        </form>
        <div className='flex justify-between items-center mt-10'>
          <ul className='flex gap-5 text-xl'>
            {OrderList.map((item) => (
              <li
                key={item.id}
                className={`
                      hover:cursor-pointer
                      ${orderId === item.id ? 'text-black' : 'text-gray-300'} 
                    `}
                onClick={() => selectOrder(item.id)}
              >
                {item.title}
              </li>
            ))}
          </ul>
          <Button onClick={handleWrite}>글쓰기</Button>
        </div>
        <hr className='my-5' />
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
      </section>
    </div>
  )
}
