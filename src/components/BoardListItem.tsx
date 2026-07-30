import { useNavigate } from 'react-router-dom'
import { Eye, MessageCircle } from 'lucide-react'

import { BoardItemDto } from '@/types/Dto'
import { formatDate, sanitizeContent } from '@/lib/utils'
import Chip from '@/components/Chip'

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
      className='cursor-pointer rounded-xl border border-gray-100 p-5 transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm'
      onClick={() => handleNavigate(board.boardId)}
    >
      <div className='flex items-center gap-2'>
        <Chip content={board.recurit} />
        <Chip
          content={board.connectionType === 'ONLINE' ? '온라인' : '오프라인'}
        />
        <Chip content={board.type} />
      </div>
      <h2 className='mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-gray-900'>
        {board.title}
      </h2>
      <p className='mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500'>
        {sanitizeContent(board.content)}
      </p>
      <div className='mt-4 flex items-center justify-between text-sm text-gray-400'>
        <div className='flex items-center gap-2'>
          <span className='font-medium text-gray-600'>{board.nickname}</span>
          <span className='text-gray-300'>·</span>
          <span>{formatDate(board.time)}</span>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Eye className='h-4 w-4' />
            <span>{board.hitCnt}</span>
          </div>
          <div className='flex items-center gap-1'>
            <MessageCircle className='h-4 w-4' />
            <span>{board.replyCnt}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
