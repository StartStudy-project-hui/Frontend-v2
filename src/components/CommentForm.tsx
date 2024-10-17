import { useEffect, useRef, useState } from 'react'

import { useAuthStore, useTriggerStore } from '@/lib/zustand/store'
import { useCrerateComment, useUpdateComment } from '@/lib/react-query/queries'
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
  const [focused, setFoucsed] = useState(false)
  const [content, setContent] = useState(editContent)
  const formRef = useRef<HTMLFormElement>(null)

  const { mutateAsync: createCommentAsync, isPending: isCreatingComment } =
    useCrerateComment()
  const { mutateAsync: updateCommentAsync, isPending: isUpdatingComment } =
    useUpdateComment()

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
    setFoucsed(false)
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
        className={`${appear === 'form' ? 'min-h-[100px]' : ''} flex flex-col gap-3 mt-5 min-h-[50px]`}
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <textarea
          className='px-2 w-full border-b border-b-gray-300 outline-none focus:border-b-black overflow-y-hidden resize-none'
          placeholder={`${
            isAuthenticated ? '댓글 추가...' : '로그인 후 이용가능합니다'
          }`}
          disabled={!isAuthenticated}
          required
          ref={textAreaRef}
          value={content}
          onInput={handleInput}
          onFocus={() => setFoucsed(true)}
        />
        {focused && (
          <div className='flex gap-2 self-end'>
            <button
              // disabled={isCreating || isUpdating}
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              // disabled={isCreating || isUpdating}
              type='submit'
            >
              저장
              {/* {isCreating || isUpdating ? <Loader /> : '저장'} */}
            </button>
          </div>
        )}
      </form>
    </>
  )
}
