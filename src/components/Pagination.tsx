import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  Pagination as Paging,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type props = {
  totalPages: number
  handlePageChange: (num: number) => void
}

export default function Pagination({ totalPages, handlePageChange }: props) {
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [prevPages, setPrevPages] = useState([] as number[])
  const [nextPages, setNextPages] = useState([] as number[])

  const pageRange = 5

  useEffect(() => {
    const page = Number(searchParams.get('page'))
    if (page) setCurrentPage(page + 1)
  }, [searchParams])

  useEffect(() => {
    const _prevPages = []
    const _nextPages = []

    for (let i = currentPage - pageRange; i < currentPage; i++) {
      if (i > 0) _prevPages.push(i)
    }
    for (let i = currentPage + 1; i < currentPage + pageRange; i++) {
      if (i <= totalPages) _nextPages.push(i)
    }

    setPrevPages(_prevPages)
    setNextPages(_nextPages)
  }, [totalPages, currentPage])

  const handleClick = (num: number) => {
    setCurrentPage(num)
    handlePageChange(num)
  }

  return (
    <div className='flex justify-center'>
      <Paging>
        <PaginationContent className='gap-1'>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handleClick(currentPage - 1)}
              aria-disabled={prevPages.length === 0}
              tabIndex={prevPages.length === 0 ? -1 : 0}
              className={`${prevPages.length === 0 ? 'pointer-events-none opacity-40' : ''} cursor-pointer rounded-lg`}
            />
          </PaginationItem>

          <PaginationItem>
            {prevPages.map((num) => (
              <PaginationLink
                key={num}
                onClick={() => handleClick(num)}
                className='cursor-pointer rounded-lg text-gray-500'
              >
                {num}
              </PaginationLink>
            ))}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink className='cursor-pointer rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-600 hover:text-white'>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            {nextPages.map((num) => (
              <PaginationLink
                key={num}
                onClick={() => handleClick(num)}
                className='cursor-pointer rounded-lg text-gray-500'
              >
                {num}
              </PaginationLink>
            ))}
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => handleClick(currentPage + 1)}
              aria-disabled={nextPages.length === 0}
              tabIndex={nextPages.length === 0 ? -1 : 0}
              className={`${nextPages.length === 0 ? 'pointer-events-none opacity-40' : ''} cursor-pointer rounded-lg`}
            />
          </PaginationItem>
          {/* <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem> */}
        </PaginationContent>
      </Paging>
    </div>
  )
}
