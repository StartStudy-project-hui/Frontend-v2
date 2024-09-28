import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HtmlEditor } from '@/components'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createWriteConfig } from '@/lib/axios/AxiosModule'
import { useAuthStore } from '@/lib/zustand/store'
import { sanitizeContent } from '@/lib/utils'

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

export default function Write() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userinfo = useAuthStore((state) => state.userinfo)

  const [category, setCategory] = useState('프로젝트')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleCancle = () => {
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
      const config = createWriteConfig({
        category,
        title,
        content,
        nickname: userinfo!.nickname,
      })
      await axios(config)
      navigate('/')
    } catch (e) {
      toast({
        title: '포스팅 중 서버에러가 발생했습니다.',
      })
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      toast({
        title: '로그인이 필요한 기능입니다.',
      })
      return
    }
  }, [])

  return (
    <form className='mt-8 mx-auto px-5 max-w-screen-lg' onSubmit={handleSubmit}>
      <div className='flex items-center gap-3'>
        <span className='font-bold'>카테고리</span>
        <select
          className='p-3 border'
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
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className='mt-5 h-96'>
        <HtmlEditor onChange={setContent} />
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
