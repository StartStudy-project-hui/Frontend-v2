import { useState } from 'react'

import { useGetMyBlacklistHistory } from '@/lib/react-query/queries'
import { BlacklistStatusList, BlacklistActionList } from '@/constants'

const statusLabel = (value: string) =>
  BlacklistStatusList.find((item) => item.value === value)?.title || value

const actionLabel = (value: string) =>
  BlacklistActionList.find((item) => item.value === value)?.title || value

const formatDateTime = (value: string) => value.replace('T', ' ').slice(0, 19)

export default function Blacklist() {
  const [page, setPage] = useState(0)
  const { data: historyResponse } = useGetMyBlacklistHistory(page)

  const isBlocked = historyResponse?.content.some(
    (item) => item.status === 'ACTIVE' || item.status === 'PERMANENT'
  )

  return (
    <div className='flex w-full flex-col gap-6'>
      <h2 className='text-lg font-bold text-gray-900'>블랙리스트</h2>

      {historyResponse && (
        <div
          className={`rounded-xl border px-5 py-4 text-sm font-medium
            ${
              isBlocked
                ? 'border-red-100 bg-red-50 text-red-700'
                : 'border-green-100 bg-green-50 text-green-700'
            }`}
        >
          {isBlocked
            ? '현재 계정에 제재가 적용되어 있습니다.'
            : '현재 계정에 적용 중인 제재가 없습니다.'}
        </div>
      )}

      <div className='relative overflow-hidden overflow-x-auto rounded-xl border border-gray-100'>
        <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
          <thead className='bg-gray-50 text-xs font-semibold text-gray-500'>
            <tr>
              <th scope='col' className='px-6 py-3'>일시</th>
              <th scope='col' className='px-6 py-3'>작업내용</th>
              <th scope='col' className='min-w-[10rem] px-6 py-3'>사유</th>
              <th scope='col' className='px-6 py-3'>상태</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {historyResponse?.content.map((item) => (
              <tr className='bg-white transition-colors hover:bg-gray-50' key={item.id}>
                <td className='whitespace-nowrap px-6 py-4'>{formatDateTime(item.createdAt)}</td>
                <td className='whitespace-nowrap px-6 py-4'>{actionLabel(item.action)}</td>
                <td className='px-6 py-4'>{item.reason}</td>
                <td className='whitespace-nowrap px-6 py-4'>{statusLabel(item.status)}</td>
              </tr>
            ))}
            {historyResponse?.content.length === 0 && (
              <tr>
                <td colSpan={4} className='px-6 py-8 text-center text-gray-400'>
                  차단 이력이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {historyResponse && (page > 0 || !historyResponse.last) && (
        <div className='flex items-center justify-center gap-3 text-sm'>
          <button
            type='button'
            className='disabled:pointer-events-none disabled:opacity-40'
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </button>
          <span className='font-medium text-gray-700'>{page + 1}</span>
          <button
            type='button'
            className='disabled:pointer-events-none disabled:opacity-40'
            disabled={historyResponse.last}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
