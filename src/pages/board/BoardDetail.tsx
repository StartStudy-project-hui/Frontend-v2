import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Eye } from 'lucide-react'

import { useGetPostById, useUpdateRecruit } from '@/lib/react-query/queries'
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

  console.log('data', boardData);
  useEffect(() => {
    fetchPostDetail()
  }, [fetchPostDetail, trigger])

  const toggleRecruit = async () => {
    if (boardId) {
      const recruit = boardData?.recruit === '모집중' ? '모집완료' : '모집중'
      await updateRecruitAsync({ boardId, recruit })
      setTrigger()
      toast({
        title: '모집 구분을 변경하였습니다',
      })
    }
  }

  return (
    <div className='mt-10 mx-auto px-5 w-full max-w-screen-lg'>
      {boardData && boardId && (
        <div>
          <div>
            <div>
              <button onClick={() => navigate(-1)}>
                <ChevronLeft width={48} height={48} color='#525151' />
              </button>
            </div>
            <h1 className='mt-5 text-4xl font-bold'>{boardData.title}</h1>
            <div className='flex justify-between mt-8'>
              <div className='flex gap-5'>
                <div className='font-bold'>{boardData.boardWriteNickname}</div>
                <div className='text-gray-500'>
                  {formatDate(boardData.createTime)}
                </div>
              </div>
              <div className='flex gap-1'>
                <Eye /> {boardData.viewCnt}
              </div>
            </div>
            <div className='flex justify-between items-center mt-5'>
              <div className='flex gap-3'>
                <Chip content={boardData.category} />
                <Chip content={boardData.connectionType} />
                <Chip content={boardData.recruit} />
                {userInfo?.nickname === boardData.boardWriteNickname && (
                  <button
                    className='p-1 border-l rounded-lg text-sm'
                    onClick={toggleRecruit}
                  >
                    모집변경
                  </button>
                )}
              </div>
              <BoardDetailOptions boardId={boardId} boardData={boardData} />
            </div>
          </div>
          <hr className='my-5 border-gray-300' />
          <section className='my-10 min-h-48'>
            <div
              className='reset-all'
              dangerouslySetInnerHTML={{ __html: boardData.content }}
            />
            <div className='mt-5 max-w-[500px]'>
              {boardData.offlineLocation && (
                <>
                  <span className='font-bold'>오프라인 위치</span>
                  <KakaoMap
                    targetCoords={[
                      boardData.offlineLocation.x,
                      boardData.offlineLocation.y,
                    ]}
                  />
                </>
              )}
            </div>
          </section>
          {/* <section> */}
          {/* </section> */}
          <section className='mb-48'>
            <hr className='my-5' />
            <div className='flex gap-2 my-5'>
              <span className='font-bold'>댓글</span>
              <span className='font-bold'>
                {boardData.replyResponseDto?.getTotal}
              </span>
            </div>
            <Comment boardId={boardId!} boardData={boardData} />
          </section>
        </div>
      )}
    </div>
  )
}
