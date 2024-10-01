import {
  createPostLikePostConfig,
  DeleteLikePostConfig,
} from '@/lib/axios/AxiosModule'
import { useTriggerStore } from '@/lib/zustand/store'
import { BoardDetailDto } from '@/types/Dto'
import axios from 'axios'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function BoardDetailOptions({ boardId, boardData }: props) {
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

  return (
    <div className='flex gap-5'>
      <button onClick={toggleBoardFavorites}>
        <>
          {isFavorite && <Star color='gray' fill='yellow' />}
          {!isFavorite && <Star color='black' />}
        </>
      </button>
      <button>
        <Pencil />
      </button>
      <button>
        <Trash2 color='red' />
      </button>
    </div>
  )
}
