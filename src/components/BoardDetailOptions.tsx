import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Star, Trash2 } from 'lucide-react'

import { BoardDetailDto } from '@/types/Dto'
import {
  useDeletePost,
  useDeletePostFromAdmin,
  useLikePostById,
  useUnlikePostById,
} from '@/lib/react-query/queries'
import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { toast } from '@/hooks/use-toast'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function BoardDetailOptions({ boardId, boardData }: props) {
  const navigate = useNavigate()
  const abortControllerRef = useRef<AbortController | null>(null)
  const userInfo = useAuthStore((state) => state.userinfo)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setTrigger = useTriggerStore((state) => state.setTrigger)

  const [isFavorite, setIsFavorite] = useState(
    boardData.postLike === '관심 완료'
  )

  const { mutateAsync: deletePostAsync, isPending: isDeletingPost } =
    useDeletePost()
  const { mutateAsync: likePostAsync, isPending: isFetchingLikePost } =
    useLikePostById()
  const { mutateAsync: unlikePostAsync, isPending: isFetchingUnlikePost } =
    useUnlikePostById()
  const {
    mutateAsync: deletePostFromAdminAsync,
    isPending: isDeletingPostFromAdmin,
  } = useDeletePostFromAdmin()

  useEffect(() => {
    setIsFavorite(boardData.postLike === '관심 완료')
  }, [boardData])

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
          await likePostAsync({ boardId, signal })
        } else {
          await unlikePostAsync({ postLikeId: boardData.postLikeId, signal })
        }
        setIsFavorite(!isFavorite)
        setTrigger()
      } finally {
        abortControllerRef.current = null
      }
    }
  }

  const handleDeleteBoard = async () => {
    if (confirm('정말로 게시글을 삭제하시겠어요?'))
      await deletePostAsync({ boardId })
    navigate(-1)
    toast({
      title: '게시글이 삭제되었습니다',
    })
  }

  const handleAdminDeleteBoard = async () => {
    await deletePostFromAdminAsync(boardId)
    navigate(-1)
    toast({
      title: '게시글이 삭제되었습니다',
    })
  }

  if (!isAuthenticated) return

  return (
    <div className='flex gap-5'>
      {userInfo?.role === 'ROLE_ADMIN' && (
        <button onClick={handleAdminDeleteBoard}>
          <span className='text-red-500'>삭제(관리자)</span>
        </button>
      )}
      <button onClick={toggleBoardFavorites}>
        <>
          {isFavorite && <Star color='gray' fill='yellow' />}
          {!isFavorite && <Star color='black' />}
        </>
      </button>
      {userInfo?.nickname === boardData.boardWriteNickname && (
        <>
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
        </>
      )}
    </div>
  )
}
