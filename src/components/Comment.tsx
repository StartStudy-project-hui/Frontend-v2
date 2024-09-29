import CommentForm from '@/components/CommentForm'
import { useToast } from '@/hooks/use-toast'
import { createDeleteCommentConfig } from '@/lib/axios/AxiosModule'
import { formatDate } from '@/lib/utils'
import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { BoardDetailDto } from '@/types/Dto'
import axios from 'axios'
import { title } from 'process'
import { useState } from 'react'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function Comment({ boardId, boardData }: props) {
  const { toast } = useToast()
  const setTrigger = useTriggerStore((state) => state.setTrigger)
  const userinfo = useAuthStore((state) => state.userinfo)

  const [editId, setEditId] = useState('')

  const handleDelete = async (replyId: string) => {
    try {
      const config = createDeleteCommentConfig(replyId)
      const res = await axios(config)
      console.log('comment D:', res)
      setTrigger()
      toast({
        title: '댓글이 삭제되었습니다',
      })
    } catch (e) {
      toast({
        title: '댓글 삭제중 에러가 발생했습니다',
      })
      console.log(e)
    }
  }

  return (
    <div>
      <CommentForm appear='form' boardId={boardId!} action='create' />
      <ul className='flex flex-col gap-8 mt-5'>
        {boardData.replyResponseDto.replies.map((comment) => {
          return (
            <li className='h-fit' key={comment.replyId}>
              <div>
                <div className='flex gap-5'>
                  <div className='font-bold'>{comment.nickname}</div>
                  <div className='text-gray-500'>
                    {formatDate(comment.updateTime)}
                  </div>
                  {userinfo?.email === comment.nickname && (
                    <div className='flex gap-2'>
                      <button onClick={() => setEditId(comment.replyId!)}>
                        수정
                      </button>
                      <button onClick={() => handleDelete(comment.replyId!)}>
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                {editId === comment.replyId && (
                  <CommentForm
                    appear='edit'
                    action='update'
                    boardId={boardId}
                    editContent={comment.content}
                    editId={editId}
                    setEditId={setEditId}
                  />
                )}
                {!(editId === comment.replyId) && (
                  <p className='mt-1 text-lg'>{comment.content}</p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
