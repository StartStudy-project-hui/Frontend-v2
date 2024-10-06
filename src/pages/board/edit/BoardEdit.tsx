import axios from 'axios'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HtmlEditor } from '@/components'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createModifyPostConfig } from '@/lib/axios/AxiosModule'
import { sanitizeContent } from '@/lib/utils'
import { ModifyPostInfo } from '@/types/Dto'

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
  const { toast } = useToast()

  const [category, setCategory] = useState(location.category)
  const [title, setTitle] = useState(location.title)
  const [content, setContent] = useState(location.content)

  console.log(location)

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

    try {
      const config = createModifyPostConfig({
        category,
        title,
        content,
        boardId: location.boardId,
      })
      await axios(config)
      navigate('/')
    } catch (e) {
      toast({
        title: '포스팅 중 서버에러가 발생했습니다.',
      })
    }
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
            <option key={item.id}>{item.title}</option>
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
