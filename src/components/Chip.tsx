import { useEffect, useState } from 'react'

type props = {
  content: string
}

export default function Chip({ content }: props) {
  const [BackgroundColor, setBackgroundColor] = useState('')
  const [textColor, setTextColor] = useState('')

  useEffect(() => {
    let backgroundColor = ''
    let textColor = 'text-white'

    switch (content) {
      case '모집완료':
        backgroundColor = 'bg-[#F13015]'
        break
      case '모집중':
        backgroundColor = 'bg-[#00964E]'
        break

      case 'CS':
        backgroundColor = 'bg-[#F1DE08]'
        textColor = 'textblack'
        break
      case '기타':
        backgroundColor = 'bg-[#30A9DE]'
        break
      case '코테':
        backgroundColor = 'bg-[#2B0EDF]'
        break
      case '프로젝트':
        backgroundColor = 'bg-[#D400F6]'
        break

      case '온라인':
        backgroundColor = 'bg-[#FF61EF]'
        break
      case '오프라인':
        backgroundColor = 'bg-[#FF7F50]'
        break
    }

    setBackgroundColor(backgroundColor)
    setTextColor(textColor)
  }, [])

  return (
    <span className={`${BackgroundColor} ${textColor} px-2 py-1 rounded-lg`}>
      {content}
    </span>
  )
}
