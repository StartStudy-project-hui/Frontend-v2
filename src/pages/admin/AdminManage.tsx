import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

import { useGetUsersFromAdmin } from '@/lib/react-query/queries'
import { Pagination } from '@/components'
import { Button } from '@/components/ui/button'

export default function AdminManage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchKeyword, setSearchKeyword] = useState('')

  const {
    data: userResponse,
    isPending: isFetchingUsersFromAdmin,
    refetch: fetchUsersFromAdmin,
  } = useGetUsersFromAdmin({
    username: searchParams.get('username') || undefined,
    page: searchParams.get('page') || undefined,
  })

  useEffect(() => {
    history.scrollRestoration = 'auto'
    fetchUsersFromAdmin()
  }, [searchParams])

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    searchParams.set('username', searchKeyword)
    setSearchParams(searchParams, { preventScrollReset: true })
  }

  const handlePageChange = (pageNum: number) => {
    searchParams.set('page', (pageNum - 1).toString())
    setSearchParams(searchParams)
  }

  return (
    <div className='w-full'>
      <section>
        <form className='flex items-center gap-3' onSubmit={handleSearch}>
          <div className='relative flex items-center w-full'>
            <Search className='absolute left-2' />
            <input
              className='pl-10 py-2 w-full border'
              placeholder='유저 검색'
              onChange={onSearchInputChange}
            />
          </div>
          <Button
            className='h-full px-10 py-2 font-bold whitespace-nowrap'
            type='submit'
          >
            검색
          </Button>
        </form>
      </section>
      <section className='mt-5'>
        <div className='flex gap-3 text-lg'>
          전체 사용자{' '}
          <span className='font-bold'>{userResponse?.content.length}</span>
        </div>
        <div className='relative mt-5 overflow-x-auto'>
          <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
            <thead className='text-xs text-gray-700 bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Seq
                </th>
                <th scope='col' className='px-6 py-3'>
                  이메일
                </th>
                <th scope='col' className='px-6 py-3'>
                  유저명
                </th>
                <th scope='col' className='px-6 py-3'>
                  닉네임
                </th>
                <th scope='col' className='px-6 py-3'>
                  권한
                </th>
                <th scope='col' className='px-6 py-3'>
                  가빙 방법
                </th>
              </tr>
            </thead>
            <tbody>
              {userResponse?.content.map((item) => (
                <tr className='bg-white border-b' key={item.email}>
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
                  >
                    {item.seq}
                  </th>
                  <td className='px-6 py-4'>{item.email}</td>
                  <td className='px-6 py-4'>{item.username}</td>
                  <td className='px-6 py-4'>{item.nickname}</td>
                  <td className='px-6 py-4'>{item.role}</td>
                  <td className='px-6 py-4'>{item.socialType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {userResponse && (
            <Pagination
              totalPages={userResponse.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </div>
  )
}
