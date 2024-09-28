import { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface HtmlEditorProps {
  initialValue?: string
  onChange?: (value: string) => void
}

export default function HtmlEditor({
  initialValue,
  onChange,
}: HtmlEditorProps) {
  const quillRef = useRef(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialValue) {
      setContent(initialValue)
    }
  }, [initialValue])
  const modules = {
    toolbar: {
      container: [
        ['image'],
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link'],
      ],
    },
  }

  const handleChange = (value: string) => {
    setContent(value)
    onChange?.(value)
  }

  return (
    <ReactQuill
      ref={quillRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      modules={modules}
      value={content}
      onChange={handleChange}
    />
  )
}
