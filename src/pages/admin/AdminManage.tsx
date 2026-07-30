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
    data: userResponse, refetch: fetchUsersFromAdmin } = useGetUsersFromAdmin({
      username: searchParams.get('username') || undefined,
      page: searchParams.get('page') || undefined,
    }
  )

  useEffect(() => {
    history.scrollRestoration = 'auto'
    fetchUsersFromAdmin()
  }, [fetchUsersFromAdmin, searchParams])

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
          <div className='relative flex w-full items-center'>
            <Search className='absolute left-3.5 h-4 w-4 text-gray-400' />
            <input
              className='w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
              placeholder='유저 검색'
              onChange={onSearchInputChange}
            />
          </div>
          <Button
            className='h-full whitespace-nowrap rounded-lg px-6 font-semibold'
            type='submit'
          >
            검색
          </Button>
        </form>
      </section>
      <section className='mt-6'>
        <div className='flex items-center gap-2 text-sm font-medium text-gray-500'>
          전체 사용자
          <span className='font-bold text-gray-900'>
            {userResponse?.content.length}
          </span>
        </div>
        <div className='relative mt-4 overflow-hidden overflow-x-auto rounded-xl border border-gray-100'>
          <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
            <thead className='bg-gray-50 text-xs font-semibold text-gray-500'>
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
                  가입 방법
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {userResponse?.content.map((item) => (
                <tr className='bg-white transition-colors hover:bg-gray-50' key={item.email}>
                  <th
                    scope='row'
                    className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
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
        </div>
        {userResponse && (
          <div className='mt-6'>
            <Pagination
              totalPages={userResponse.totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  )
}
