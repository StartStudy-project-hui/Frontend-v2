import { useNavigate } from 'react-router-dom'
import Chip from '@/components/Chip'
import { formatDate, sanitizeContent } from '@/lib/utils'
import { BoardItemDto } from '@/types/Dto'

type props = {
  board: BoardItemDto
}

export default function BoardListItem({ board }: props) {
  const navigate = useNavigate()

  const handleNavigate = (boardId: number) => {
    navigate(`/board/${boardId}`)
  }

  return (
    <div
      className='hover:cursor-pointer'
      onClick={() => handleNavigate(board.boardId)}
    >
      <div className='flex items-center gap-5'>
        <div className='flex gap-1 min-w-52'>
          <Chip content={board.recurit} />
          <Chip
            content={board.connectionType === 'ONLINE' ? '온라인' : '오프라인'}
          />
          <Chip content={board.type} />
        </div>
        <h2 className='text-lg font-bold text-ellipsis whitespace-nowrap overflow-hidden'>
          {board.title}
        </h2>
      </div>
      <p className='mt-4 text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden'>
        {sanitizeContent(board.content)}
      </p>
      <div className='flex justify-between mt-4 text-gray-500'>
        <div className='flex gap-3 items-center'>
          <span className='text-black text-sm font-semibold'>
            {board.nickname}
          </span>
          <span>{formatDate(board.time)}</span>
        </div>
        <div className='flex gap-5'>
          <div className='flex gap-1'>
            조회수
            <span>{board.hitCnt}</span>
          </div>
          <div className='flex gap-1'>
            댓글수
            <span>{board.replyCnt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
