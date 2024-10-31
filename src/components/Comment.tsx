import { useState } from 'react'

import { BoardDetailDto, PureReplyDto, ReplyDto } from '@/types/Dto'
import { formatDate } from '@/lib/utils'
import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { useDeleteCommentById } from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'
import CommentForm from '@/components/CommentForm'

type props = {
  boardId: string
  boardData: BoardDetailDto
}

export default function Comment({ boardId, boardData }: props) {
  const setTrigger = useTriggerStore((state) => state.setTrigger)
  const userinfo = useAuthStore((state) => state.userinfo)

  const [editId, setEditId] = useState('')
  const [parentId, setParentId] = useState('')

  const { mutateAsync: deleteCommentAsync, isPending: isDeletingComment } =
    useDeleteCommentById()

  const handleDelete = async (replyId: string) => {
    const res = await deleteCommentAsync(replyId)
    setTrigger()
    toast({
      title: '댓글이 삭제되었습니다',
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
      <ul className='flex flex-col gap-8 mt-5'>
        {boardData.replyResponseDto.replies.map((comment) => {
          const replies = pureReplies(comment.children)

          return (
            <li className='h-fit' key={comment.replyId}>
              <div>
                <div className='flex gap-5'>
                  <div className='font-bold'>{comment.nickname}</div>
                  <div className='text-gray-500'>
                    {formatDate(comment.updateTime)}
                  </div>
                  {userinfo?.nickname === comment.nickname && (
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
                    className='mt-1 ml-2 text-gray-500'
                    onClick={() => setParentId(comment.replyId!)}
                  >
                    답글
                  </button>
                )}
              </div>
              <ul className='mt-1 ml-5'>
                {replies.map((reply) => (
                  <li key={reply.replyId}>
                    <div>
                      <div className='flex gap-5'>
                        <div className='font-bold'>{reply.nickname}</div>
                        <div className='text-gray-500'>
                          {formatDate(reply.updateTime)}
                        </div>
                        {userinfo?.nickname === reply.nickname && (
                          <div className='flex gap-2'>
                            <button onClick={() => setEditId(reply.replyId!)}>
                              수정
                            </button>
                            <button
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
                        <p className='mt-1 text-lg'>{reply.content}</p>
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
                          className='mt-1 ml-2 text-gray-500'
                          onClick={() => setParentId(reply.replyId!)}
                        >
                          답글
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
