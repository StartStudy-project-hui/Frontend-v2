'use client'

import { useRef, useState } from 'react'

import { createAddCommentConfig } from '@/lib/axios/AxiosModule'
import axios from 'axios'
import { useTriggerStore } from '@/lib/zustand/store'
import { useToast } from '@/hooks/use-toast'

type props = {
  appear: 'form' | 'reply'
  boardId: string
  replyId?: string
  action: 'create' | 'update'
}

export default function CommentForm({ appear, boardId, action }: props) {
  const { toast } = useToast()
  const setTrigger = useTriggerStore((state) => state.setTrigger)

  const [focused, setFoucsed] = useState(false)
  const [content, setContent] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto'
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'

    setContent(e.currentTarget.value)
  }

  const handleCancel = () => {
    // if (setEditId) setEditId('')
    // else setFoucsed(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('예?', content)
    if (!content) return
    try {
      if (action === 'create') {
        const config = createAddCommentConfig({ boardId, content })
        const res = await axios(config)

        console.log('comment C:', res)
        setTrigger()
        toast({
          title: '댓글이 추가되었습니다',
        })
      } else if (action === 'update') {
        // const config = createEditCommentConfig({ content })
      }
    } catch (e) {
      toast({
        title: '댓글 업데이트 중 에러가 발생했습니다',
      })
      console.log(e)
    }
    if (formRef.current) formRef.current.reset()
  }

  return (
    <>
      <form
        className='flex flex-col gap-3 min-h-[50px] md:min-h-[100px]'
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <textarea
          placeholder={`${
            '댓글 추가...'
            // isAuthenticated ? '댓글 추가...' : '로그인 후 이용가능합니다'
          }`}
          //   disabled={!isAuthenticated}
          required
          onInput={handleInput}
          onFocus={() => setFoucsed(true)}
          className='px-2 py-1 w-full border-b border-b-gray-300 outline-none focus:border-b-black overflow-y-hidden resize-none'
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
