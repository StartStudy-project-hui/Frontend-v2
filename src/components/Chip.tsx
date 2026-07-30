type props = {
  content: string
}

const CHIP_STYLES: Record<string, string> = {
  모집완료: 'bg-rose-50 text-rose-600',
  COMPLETED: 'bg-rose-50 text-rose-600',
  모집중: 'bg-emerald-50 text-emerald-600',
  RECRUITING: 'bg-emerald-50 text-emerald-600',

  CS: 'bg-amber-50 text-amber-700',
  기타: 'bg-sky-50 text-sky-600',
  ETC: 'bg-sky-50 text-sky-600',
  코테: 'bg-indigo-50 text-indigo-600',
  CODING_TEST: 'bg-indigo-50 text-indigo-600',
  프로젝트: 'bg-fuchsia-50 text-fuchsia-600',
  PROJECT: 'bg-fuchsia-50 text-fuchsia-600',

  온라인: 'bg-pink-50 text-pink-600',
  ONLINE: 'bg-pink-50 text-pink-600',
  오프라인: 'bg-orange-50 text-orange-600',
  OFFLINE: 'bg-orange-50 text-orange-600',
}

export default function Chip({ content }: props) {
  const style = CHIP_STYLES[content] ?? 'bg-gray-100 text-gray-600'

  return (
    <span
      className={`${style} inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap`}
    >
      {content}
    </span>
  )
}
