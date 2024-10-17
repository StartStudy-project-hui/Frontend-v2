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
    value: '프로젝트',
  },
  {
    id: 1,
    title: '코테',
    value: '코테',
  },
  {
    id: 2,
    title: 'CS',
    value: 'CS',
  },
  {
    id: 3,
    title: 'ETC',
    value: '기타',
  },
]

export default function BoardEdit() {
  const navigate = useNavigate()
  const location = useLocation().state as ModifyPostInfo

  const [category, setCategory] = useState(location.category)
  const [title, setTitle] = useState(location.title)
  const [content, setContent] = useState(location.content)
  const [place, setPlace] = useState('온라인')
  const [coords, setCoords] = useState<number[]>([])

  const { mutateAsync: updatePostAsync, isPending: isUpdatingPost } =
    useUpdatePost()

  const handleChangePlace = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '온라인') setCoords([])
    setPlace(e.target.value)
  }

  const handleCancle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    <form className='mt-8 mx-auto px-5 max-w-screen-lg' onSubmit={handleSubmit}>
      <div className='flex items-center gap-3'>
        <span className='font-bold'>카테고리</span>
        <select
          className='p-3 border'
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
        className='mt-5 text-2xl'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className='mt-5 h-96'>
        <HtmlEditor initialValue={content} onChange={setContent} />
      </div>
      <div className='mt-5'>
        <div className='flex items-center gap-3'>
          <span className='font-bold'>장소</span>
          <select className='p-3 border' onChange={handleChangePlace}>
            <option value={'온라인'}>온라인</option>
            <option value={'오프라인'}>오프라인</option>
          </select>
        </div>
        <div className='mt-5'>
          {place === '오프라인' && (
            <KakaoMap
              // targetCoords={[37.565942629174934, 126.98883954144402]}
              setCoords={setCoords}
            />
          )}
        </div>
      </div>
      <div className='flex justify-between mt-5'>
        <div></div>
        <div className='flex gap-3'>
          <Button
            className='text-black font-bold bg-white hover:bg-transparent'
            onClick={handleCancle}
          >
            취소
          </Button>
          <Button className='' type='submit'>
            등록
          </Button>
        </div>
      </div>
    </form>
  )
}
