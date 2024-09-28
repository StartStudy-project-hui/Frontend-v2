import { Chip, CommentForm } from '@/components'
import { POST_DETAIL, REPLYS } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { createReadPostConfig } from '@/lib/axios/AxiosModule'
import { formatDate } from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/store'
import { BoardDetailDto } from '@/types/Dto'
import axios from 'axios'
import { ChevronLeft, Eye, Pencil, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function BoardDetail() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const userinfo = useAuthStore((state) => state.userinfo)

  const [boardData, setBoardData] = useState<BoardDetailDto>()

  useEffect(() => {
    getPostDetail()
  }, [])
  const getPostDetail = async () => {
    if (boardId) {
      try {
        const config = createReadPostConfig(boardId)
        const res = await axios(config)
        console.log(res.data)
        setBoardData(res.data)
      } catch (e) {
        toast({
          title: '게시글 정보를 받아오는데 실패하였습니다.',
        })
        console.log(e)
      }
    }
  }

  return (
    <div className='mt-10 mx-auto px-5 w-full max-w-screen-lg'>
      {boardData && (
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
                <Chip content={boardData.recruit} />
              </div>
              <div className='flex gap-5'>
                <button>
                  <Star color='black' fill='yellow' />
                </button>
                <button>
                  <Pencil />
                </button>
                <button>
                  <Trash2 color='red' />
                </button>
              </div>
            </div>
          </div>

          <hr className='my-5 border-gray-300' />

          <section className='my-10 min-h-48'>
            <div
              className='reset-all'
              dangerouslySetInnerHTML={{ __html: boardData.content }}
            />
          </section>

          <section className='mb-48'>
            <hr className='my-5' />
            <div className='flex gap-2 my-5'>
              <span className='font-bold'>댓글</span>
              <span className='font-bold'>8</span>
            </div>
            <CommentForm />
            {/* <ul className='flex flex-col gap-8 mt-5'>
          {REPLYS.map((reply) => (
            <li key={reply.replyId}>
              <div className='flex gap-5'>
                <div className='font-bold'>
                  {reply.memberRequestDto.nickname}
                </div>
                <div className='text-gray-500'>{reply.createTime}</div>
              </div>
              <p className='mt-3'>{reply.content}</p>
            </li>
          ))}
        </ul> */}
          </section>
        </div>
      )}
    </div>
  )
}
