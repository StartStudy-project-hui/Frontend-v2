import CommentForm from '@/components/CommentForm'
import { formatDate } from '@/lib/utils'
import { BoardDetailDto } from '@/types/Dto'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function Comment({ boardId, boardData }: props) {
  return (
    <div>
      <CommentForm appear='form' boardId={boardId!} action='create' />
      <ul className='flex flex-col gap-8 mt-5'>
        {boardData.replyResponseDto.replies.map((comment) => {
          return (
            <li key={comment.replyId}>
              <div>
                <div className='flex gap-5'>
                  <div className='font-bold'>{comment.nickname}</div>
                  <div className='text-gray-500'>
                    {formatDate(comment.updateTime)}
                  </div>
                </div>
                <p className='mt-1'>{comment.content}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
