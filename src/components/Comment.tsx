import { useEffect, useState } from 'react'

import { BoardDetailDto, PureReplyDto, ReplyDto } from '@/types/Dto'
import { formatDate } from '@/lib/utils'
import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { useDeleteCommentById, useGetCommentsByBoardId } from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'
import CommentForm from '@/components/CommentForm'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function Comment({ boardId }: props) {
  const setTrigger = useTriggerStore((state) => state.setTrigger)
  const userinfo = useAuthStore((state) => state.userinfo)
  const trigger = useTriggerStore((state) => state.trigger)

  const [editId, setEditId] = useState('')
  const [parentId, setParentId] = useState('')

  const {
    data: commentData,
    refetch: fetchComments,
  } = useGetCommentsByBoardId(boardId) as {
    data: {
      replies: {
        children: any,
        replyId: string,
        nickname: string,
        updateTime: string,
        content: string,
      }[],
    },
    refetch: () => void
  }


  useEffect(() => {
    fetchComments()
  }, [fetchComments, trigger])

  const { mutateAsync: deleteCommentAsync } = useDeleteCommentById()

  const handleDelete = async (replyId: string) => {
    const res = await deleteCommentAsync(replyId)
    if (res) {
      setTrigger()
      return toast({
        title: '댓글이 삭제되었습니다',
      })
    }

    return toast({
      title: '댓글 삭제에 실패 했습니다.',
    })
  }

  const pureReplies = (children: ReplyDto[]) => {
    const pureReplyArray = [] as PureReplyDto[]

    const recurChildren = (children: ReplyDto[]) => {
      if (children.length === 0) return

      for (let i = 0; i < children.length; i++) {
        const { replyId, parentId, nickname, content, updateTime } = children[i]
        pureReplyArray.push({
          replyId,
          parentId,
          nickname,
          content,
          updateTime,
        })
        recurChildren(children[i].children)
      }
    }

    recurChildren(children)

    pureReplyArray.sort((a, b) => {
      return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
    })

    return pureReplyArray
  }

  return (
    <div>
      <CommentForm appear='form' boardId={boardId!} action='create' />
      <ul className='mt-6 flex flex-col divide-y divide-gray-100'>
        {commentData?.replies && commentData.replies.map((comment) => {
          const replies = pureReplies(comment.children)

          return (
            <li className='h-fit py-5 first:pt-0' key={comment.replyId}>
              <div>
                <div className='flex items-center gap-2 text-sm'>
                  <span className='font-semibold text-gray-800'>
                    {comment.nickname}
                  </span>
                  <span className='text-gray-300'>·</span>
                  <span className='text-gray-400'>
                    {formatDate(comment.updateTime)}
                  </span>
                  {userinfo?.nickname === comment.nickname && (
                    <div className='ml-1 flex gap-1 text-xs text-gray-400'>
                      <button
                        className='rounded px-1.5 py-0.5 transition-colors hover:bg-gray-50 hover:text-gray-700'
                        onClick={() => setEditId(comment.replyId!)}
                      >
                        수정
                      </button>
                      <button
                        className='rounded px-1.5 py-0.5 transition-colors hover:bg-red-50 hover:text-red-500'
                        onClick={() => handleDelete(comment.replyId!)}
                      >
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
                  <p className='mt-1.5 text-[15px] text-gray-700'>
                    {comment.content}
                  </p>
                )}
                {parentId === comment.replyId && (
                  <CommentForm
                    appear='reply'
                    boardId={boardId}
                    action='create'
                    parentId={parentId}
                    setParentId={setParentId}
                  />
                )}
                {!(parentId === comment.replyId) && (
                  <button
                    className='mt-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600'
                    onClick={() => setParentId(comment.replyId!)}
                  >
                    답글달기
                  </button>
                )}
              </div>
              <ul className='mt-4 ml-5 flex flex-col gap-4 border-l border-gray-100 pl-4'>
                {replies.map((reply) => (
                  <li key={reply.replyId}>
                    <div>
                      <div className='flex items-center gap-2 text-sm'>
                        <span className='font-semibold text-gray-800'>
                          {reply.nickname}
                        </span>
                        <span className='text-gray-300'>·</span>
                        <span className='text-gray-400'>
                          {formatDate(reply.updateTime)}
                        </span>
                        {userinfo?.nickname === reply.nickname && (
                          <div className='ml-1 flex gap-1 text-xs text-gray-400'>
                            <button
                              className='rounded px-1.5 py-0.5 transition-colors hover:bg-gray-50 hover:text-gray-700'
                              onClick={() => setEditId(reply.replyId!)}
                            >
                              수정
                            </button>
                            <button
                              className='rounded px-1.5 py-0.5 transition-colors hover:bg-red-50 hover:text-red-500'
                              onClick={() => handleDelete(reply.replyId!)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                      {editId === reply.replyId && (
                        <CommentForm
                          appear='edit'
                          action='update'
                          boardId={boardId}
                          editContent={reply.content}
                          editId={editId}
                          setEditId={setEditId}
                        />
                      )}
                      {!(editId === reply.replyId) && (
                        <p className='mt-1.5 text-[15px] text-gray-700'>
                          {reply.content}
                        </p>
                      )}
                      {parentId === reply.replyId && (
                        <CommentForm
                          appear='reply'
                          boardId={boardId}
                          action='create'
                          parentId={parentId}
                          setParentId={setParentId}
                        />
                      )}
                      {!(parentId === reply.replyId) && (
                        <button
                          className='mt-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600'
                          onClick={() => setParentId(reply.replyId!)}
                        >
                          답글달기
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
