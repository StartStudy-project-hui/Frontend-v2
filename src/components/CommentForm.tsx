'use client'

import { useState } from 'react'

import Loader from './Loader'

type props = {
  postId: string
  commentId?: string
  setEditId?: React.Dispatch<React.SetStateAction<string>>
  action: 'create' | 'update'
}

export default function CommentForm() {
  //     {
  //   postId,
  //   commentId,
  //   setEditId,
  //   action,
  // }: props
  const [focused, setFoucsed] = useState(false)

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto'
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
  }

  const handleCancel = () => {
    // if (setEditId) setEditId('')
    // else setFoucsed(false)
  }

  const handleSubmit = () => {}
  //   const handleSubmit = async (
  //     e: React.FormEvent<HTMLFormElement> & { target: HTMLFormElement }
  //   ) => {
  //     e.preventDefault()
  //     if (action === 'create') {
  //       await createComment({
  //         userId: user.id,
  //         postId: postId,
  //         content: (e.target[0] as HTMLInputElement).value,
  //       })
  //     } else if (action === 'update') {
  //       const res = await updateComment({
  //         commentId: commentId!,
  //         content: (e.target[0] as HTMLInputElement).value,
  //       })
  //       setEditId!('')
  //     }
  //     e.target.reset()
  //   }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3 min-h-[50px] md:min-h-[100px]'
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
