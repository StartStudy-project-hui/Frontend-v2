import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Star, Trash2 } from 'lucide-react'

import { BoardDetailDto } from '@/types/Dto'
import {
  useDeletePost,
  useDeletePostFromAdmin,
  useGetPostLikeStatus,
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
  const isTogglingRef = useRef(false)
  const userInfo = useAuthStore((state) => state.userinfo)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setTrigger = useTriggerStore((state) => state.setTrigger)

  const [isFavorite, setIsFavorite] = useState(false)
  const [postLikeId, setPostLikeId] = useState<string | null>(null)

  const { mutateAsync: deletePostAsync } =
    useDeletePost()
  const { refetch: fetchPostLikeStatus } = useGetPostLikeStatus(boardId)
  const { mutateAsync: likePostAsync } =
    useLikePostById()
  const { mutateAsync: unlikePostAsync } =
    useUnlikePostById()
  const { mutateAsync: deletePostFromAdminAsync } = useDeletePostFromAdmin()

  useEffect(() => {
    fetchPostLikeStatus().then(({ data }) => {
      if (data) {
        setIsFavorite(data.postLike === '관심 완료')
        setPostLikeId(data.postLikeId ?? null)
      }
    })
  }, [boardId, boardData])

  const toggleBoardFavorites = async () => {
    if (!boardId || isTogglingRef.current) return

    isTogglingRef.current = true
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    try {
      try {
        if (!isFavorite) {
          await likePostAsync({ boardId, signal })
        } else if (postLikeId) {
          await unlikePostAsync({ postLikeId, signal })
        }
      } finally {
        // 요청이 실패해도(예: 다른 탭에서 이미 처리된 중복 요청) 화면이
        // 서버의 실제 상태와 어긋나지 않도록 항상 최신 상태로 재동기화한다.
        const { data } = await fetchPostLikeStatus()
        if (data) {
          setIsFavorite(data.postLike === '관심 완료')
          setPostLikeId(data.postLikeId ?? null)
        }
      }
      setTrigger()
    } finally {
      abortControllerRef.current = null
      isTogglingRef.current = false
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
    <div className='flex items-center gap-1'>
      {userInfo?.role === 'ROLE_ADMIN' && (
        <button
          className='rounded-md px-2 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50'
          onClick={handleAdminDeleteBoard}
        >
          삭제(관리자)
        </button>
      )}
      <button
        className='rounded-md p-1.5 transition-colors hover:bg-gray-50'
        onClick={toggleBoardFavorites}
      >
        {isFavorite ? (
          <Star className='h-5 w-5' color='#FACC15' fill='#FACC15' />
        ) : (
          <Star className='h-5 w-5' color='#D1D5DB' />
        )}
      </button>
      {userInfo?.nickname === boardData.boardWriteNickname && (
        <>
          <Link
            className='rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600'
            to={'./edit'}
            state={{
              category: boardData.category,
              title: boardData.title,
              content: boardData.content,
              connectionType: boardData.connectionType,
              offlineLocation: boardData.offlineLocation,
              boardId,
            }}
          >
            <Pencil className='h-4 w-4' />
          </Link>
          <button
            className='rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-500'
            onClick={handleDeleteBoard}
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </>
      )}
    </div>
  )
}
