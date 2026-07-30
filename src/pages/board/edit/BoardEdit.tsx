import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ModifyPostInfo } from '@/types/Dto'
import { sanitizeContent } from '@/lib/utils'
import { useUpdatePost } from '@/lib/react-query/queries'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HtmlEditor, KakaoMap } from '@/components'

const PostCategoryList = [
  {
    id: 0,
    title: '프로젝트',
    value: 'PROJECT',
  },
  {
    id: 1,
    title: '코테',
    value: 'CODING_TEST',
  },
  {
    id: 2,
    title: 'CS',
    value: 'CS',
  },
  {
    id: 3,
    title: 'ETC',
    value: 'ETC',
  },
]

const categoryDescriptionToEnum: Record<string, string> = {
  전체: 'ALL',
  코테: 'CODING_TEST',
  프로젝트: 'PROJECT',
  CS: 'CS',
  기타: 'ETC',
}

export default function BoardEdit() {
  const navigate = useNavigate()
  const location = useLocation().state as ModifyPostInfo

  const [category, setCategory] = useState(
    categoryDescriptionToEnum[location.category] ?? location.category
  )
  const [title, setTitle] = useState(location.title)
  const [content, setContent] = useState(location.content)
  const [place, setPlace] = useState(location.connectionType || '온라인')
  const [coords, setCoords] = useState<number[]>(
    location.offlineLocation
      ? [location.offlineLocation.x, location.offlineLocation.y]
      : []
  )

  const { mutateAsync: updatePostAsync } = useUpdatePost()

  const handleChangePlace = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '온라인') setCoords([])
    setPlace(e.target.value)
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (confirm('작성중인 글을 취소하시겠어요?')) {
      navigate(-1)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const sanitizedValue = sanitizeContent(content)
    if (!sanitizedValue) {
      toast({
        title: '내용을 입력하세요!',
      })
      return
    }

    const connectionType = place === '오프라인' ? 'OFFLINE' : 'ONLINE'
    const offlineLocation =
      place === '오프라인' && coords.length > 0
        ? {
            x: coords[0],
            y: coords[1],
          }
        : null

    await updatePostAsync({
      category,
      title,
      content,
      boardId: location.boardId,
      connectionType,
      offlineLocation,
    })

    navigate('/')
  }

  return (
    <form
      className='mx-auto max-w-3xl px-6 py-10'
      onSubmit={handleSubmit}
    >
      <h1 className='text-2xl font-bold text-gray-900'>글 수정</h1>

      <div className='mt-6 flex items-center gap-3'>
        <span className='w-16 text-sm font-semibold text-gray-600'>
          카테고리
        </span>
        <select
          className='rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {PostCategoryList.map((item) => (
            <option key={item.id} value={item.value}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <Input
        className='mt-4 h-14 rounded-lg border-gray-200 px-4 text-xl font-semibold focus-visible:ring-gray-200'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className='mt-4 h-96 rounded-lg border border-gray-200'>
        <HtmlEditor initialValue={content} onChange={setContent} />
      </div>

      <div className='mt-6'>
        <div className='flex items-center gap-3'>
          <span className='w-16 text-sm font-semibold text-gray-600'>
            장소
          </span>
          <select
            className='rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100'
            value={place}
            onChange={handleChangePlace}
          >
            <option value={'온라인'}>온라인</option>
            <option value={'오프라인'}>오프라인</option>
          </select>
        </div>
        {place === '오프라인' && (
          <div className='mt-4'>
            <KakaoMap setCoords={setCoords} />
          </div>
        )}
      </div>

      <div className='mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6'>
        <Button
          type='button'
          variant='outline'
          className='rounded-lg font-semibold'
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button className='rounded-lg px-6 font-semibold' type='submit'>
          등록
        </Button>
      </div>
    </form>
  )
}
