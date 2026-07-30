import { useEffect, useRef, useState } from 'react'

import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { useCerateComment, useUpdateComment } from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'

type props = {
  appear: 'form' | 'edit' | 'reply'
  action: 'create' | 'update'
  boardId: string
  editContent?: string
  editId?: string
  setEditId?: (id: string) => void
  parentId?: string
  setParentId?: (id: string) => void
}

export default function CommentForm({
  appear,
  action,
  boardId,
  editContent,
  editId,
  setEditId,
  parentId,
  setParentId,
}: props) {
  const setTrigger = useTriggerStore((state) => state.setTrigger)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [focused, setFocused] = useState(false)
  const [content, setContent] = useState(editContent)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutateAsync: createCommentAsync } = useCerateComment()
  const { mutateAsync: updateCommentAsync } = useUpdateComment()

  useEffect(() => {
    resizeTextArea()
  }, [])

  const handleInput = () => {
    resizeTextArea()
    setContent(textAreaRef.current!.value)
  }

  const handleCancel = () => {
    if (setEditId) setEditId('')
    if (setParentId) setParentId('')
    clearTextArea()
    setFocused(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content) return

    if (action === 'create') {
      await createCommentAsync({ boardId, parentId, content })
      setTrigger()
      toast({
        title: '댓글이 추가되었습니다',
      })
    } else if (action === 'update') {
      await updateCommentAsync({ replyId: editId!, content })
      setTrigger()
      toast({
        title: '댓글이 수정되었습니다',
      })
    }
    handleCancel()
  }

  const resizeTextArea = () => {
    textAreaRef.current!.style.height = 'auto'
    textAreaRef.current!.style.height = textAreaRef.current!.scrollHeight + 'px'
  }

  const clearTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.value = ''
      textAreaRef.current.style.height = 'auto'
    }
    setContent('')
  }

  return (
    <>
      <form
        className={`${appear === 'form' ? 'min-h-[100px]' : ''} mt-3 flex min-h-[50px] flex-col gap-2`}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <textarea
          className='w-full resize-none overflow-y-hidden rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-shadow focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
          placeholder={`${
            isAuthenticated ? '댓글 추가...' : '로그인 후 이용가능합니다'
          }`}
          disabled={!isAuthenticated}
          required
          ref={textAreaRef}
          value={content}
          onInput={handleInput}
          onFocus={() => setFocused(true)}
        />
        {focused && (
          <div className='flex gap-2 self-end'>
            <button
              className='rounded-md px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50'
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              className='rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700'
              type='submit'
            >
              저장
            </button>
          </div>
        )}
      </form>
    </>
  )
}
