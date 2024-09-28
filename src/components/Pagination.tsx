import { useEffect, useState } from 'react'
import {
  Pagination as Paging,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearchParams } from 'react-router-dom'

type props = {
  totalPages: number
  handlePageChange: (num: number) => void
}

export default function Pagination({ totalPages, handlePageChange }: props) {
  const [searchParams, setSearchParams] = useSearchParams()
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
    <div className='flex justify-center mt-5'>
      <Paging>
        <PaginationContent>
          {}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handleClick(currentPage - 1)}
              aria-disabled={prevPages.length === 0}
              tabIndex={prevPages.length === 0 ? -1 : 0}
              className={`${prevPages.length === 0 ? 'pointer-events-none opacity-50' : ''} cursor-pointer`}
            />
          </PaginationItem>

          <PaginationItem>
            {prevPages.map((num) => (
              <PaginationLink
                key={num}
                onClick={() => handleClick(num)}
                className='cursor-pointer'
              >
                {num}
              </PaginationLink>
            ))}
          </PaginationItem>

          <PaginationItem>
            <PaginationLink className='font-bold border rounded-xl hover:bg-transparent hover:cursor-pointer'>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            {nextPages.map((num) => (
              <PaginationLink
                key={num}
                onClick={() => handleClick(num)}
                className='cursor-pointer'
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
              className={`${nextPages.length === 0 ? 'pointer-events-none opacity-50' : ''} cursor-pointer`}
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
