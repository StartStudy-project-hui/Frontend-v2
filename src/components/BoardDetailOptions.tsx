import { useToast } from '@/hooks/use-toast'
import {
  createAdminRemovePostConfig,
  createPostLikePostConfig,
  createRemovePostConfig,
  DeleteLikePostConfig,
} from '@/lib/axios/AxiosModule'
import { useTriggerStore } from '@/lib/zustand/store'
import { BoardDetailDto } from '@/types/Dto'
import axios from 'axios'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function BoardDetailOptions({ boardId, boardData }: props) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const abortControllerRef = useRef<AbortController | null>(null)
  const setTrigger = useTriggerStore((state) => state.setTrigger)

  const [isFavorite, setIsFavorite] = useState(
    boardData.postLike === '관심 완료'
  )

  const toggleBoardFavorites = async () => {
    if (boardId) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        setIsFavorite(!isFavorite)
      }

      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current

      try {
        if (!isFavorite) {
          const config = createPostLikePostConfig(boardId)
          await axios({
            ...config,
            signal,
          })
        } else {
          const config = DeleteLikePostConfig(boardData.postLikeId)
          await axios({
            ...config,
            signal,
          })
        }
        setIsFavorite(!isFavorite)
        setTrigger()
      } catch (e) {
        console.log(e)
      } finally {
        abortControllerRef.current = null
      }
    }
  }

  const handleDeleteBoard = async () => {
    if (confirm('정말로 게시글을 삭제하시겠어요?'))
      try {
        const config = createRemovePostConfig({ boardId })
        await axios(config)
        navigate(-1)
        toast({
          title: '게시글이 삭제되었습니다',
        })
      } catch (e) {
        console.log(e)
      }
  }

  const handleAdminDeleteBoard = async () => {
    try {
      const config = createAdminRemovePostConfig(boardId)
      await axios(config)
      navigate(-1)
      toast({
        title: '게시글이 삭제되었습니다',
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='flex gap-5'>
      <button onClick={handleAdminDeleteBoard}>
        <span className='text-red-500'>삭제(관리자)</span>
      </button>
      <button onClick={toggleBoardFavorites}>
        <>
          {isFavorite && <Star color='gray' fill='yellow' />}
          {!isFavorite && <Star color='black' />}
        </>
      </button>
      <Link
        to={'./edit'}
        state={{
          category: boardData.category,
          title: boardData.title,
          content: boardData.content,
          boardId,
        }}
      >
        <Pencil />
      </Link>
      <button onClick={handleDeleteBoard}>
        <Trash2 color='red' />
      </button>
    </div>
  )
}
