import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Eye } from 'lucide-react'

import {
  useGetPostById,
  useIncreaseViewCount,
  useUpdateRecruit,
} from '@/lib/react-query/queries'
import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { BoardDetailOptions, Chip, Comment, KakaoMap } from '@/components'

export default function BoardDetail() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const userInfo = useAuthStore((state) => state.userinfo)
  const trigger = useTriggerStore((state) => state.trigger)
  const setTrigger = useTriggerStore((state) => state.setTrigger)

  const {
    data: boardData,
    refetch: fetchPostDetail,
  } = useGetPostById(boardId)
  const { mutateAsync: updateRecruitAsync } = useUpdateRecruit()
  const { mutateAsync: increaseViewCountAsync } = useIncreaseViewCount()

  useEffect(() => {
    fetchPostDetail()
  }, [fetchPostDetail, trigger])

  useEffect(() => {
    if (boardId) {
      increaseViewCountAsync(boardId).then(() => {
        setTrigger()
      })
    }
  }, [boardId])

  const toggleRecruit = async () => {
    if (boardId) {
      const recruit = boardData?.recruitStatus === '모집중' ? '모집완료' : '모집중'
      await updateRecruitAsync({ boardId, recruit })
      setTrigger()
      toast({
        title: '모집 구분을 변경하였습니다',
      })
    }
  }

  return (
    <div className='mx-auto w-full max-w-3xl px-6 py-10'>
      {boardData && boardId && (
        <div>
          <button
            className='-ml-2 flex items-center rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='h-5 w-5' />
          </button>

          <div className='mt-4 flex flex-wrap items-center gap-2'>
            <Chip content={boardData.category} />
            <Chip content={boardData.connectionType} />
            <Chip content={boardData.recruitStatus} />
            {userInfo?.nickname === boardData.boardWriteNickname && (
              <button
                className='rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700'
                onClick={toggleRecruit}
              >
                모집변경
              </button>
            )}
          </div>

          <h1 className='mt-4 text-2xl font-bold text-gray-900 sm:text-3xl'>
            {boardData.title}
          </h1>

          <div className='mt-4 flex items-center justify-between border-b border-gray-100 pb-5'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='font-semibold text-gray-800'>
                {boardData.boardWriteNickname}
              </span>
              <span className='text-gray-300'>·</span>
              <span className='text-gray-400'>
                {formatDate(boardData.createTime)}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1 text-sm text-gray-400'>
                <Eye className='h-4 w-4' />
                {boardData.viewCnt}
              </div>
              <BoardDetailOptions boardId={boardId} boardData={boardData} />
            </div>
          </div>

          <section className='min-h-48 py-8'>
            <div
              className='reset-all leading-relaxed'
              dangerouslySetInnerHTML={{ __html: boardData.content }}
            />
            {boardData.offlineLocation && (
              <div className='mt-6 max-w-[500px]'>
                <span className='text-sm font-semibold text-gray-700'>
                  오프라인 위치
                </span>
                <div className='mt-2'>
                  <KakaoMap
                    targetCoords={[
                      boardData.offlineLocation.x,
                      boardData.offlineLocation.y,
                    ]}
                  />
                </div>
              </div>
            )}
          </section>

          <section className='border-t border-gray-100 pt-6'>
            <div className='flex items-center gap-1.5 text-sm font-semibold text-gray-800'>
              댓글
              <span className='text-gray-400'>
                {boardData.replyResponseDto?.getTotal}
              </span>
            </div>
            <div className='mt-4'>
              <Comment boardId={boardId!} boardData={boardData} />
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
