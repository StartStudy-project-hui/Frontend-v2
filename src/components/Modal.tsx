import { useEffect, useState } from 'react'
import { Apple } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SigininForm, SignupForm } from '@/components/form'
import { cn } from '@/lib/utils'

type props = {
  target?: '회원가입' | '로그인' | null
}

export default function Modal({ target }: props) {
  const [currentTarget, setCurrentTarget] = useState<typeof target>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setCurrentTarget(target)
  }, [target])

  const handleTarget = (_target: typeof target) => {
    setCurrentTarget(_target)
  }

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{target}</DialogTrigger>
      <DialogContent>
        {currentTarget === '회원가입' && (
          <>
            <DialogHeader className='flex flex-col items-center gap-2'>
              <div className='flex justify-center items-center gap-1'>
                <Apple width={64} height={64} />
                <span className='text-2xl font-extrabold'>LOGO</span>
              </div>
              <DialogTitle className='text-3xl font-semibold md:font-bold'>
                회원가입
              </DialogTitle>
              <DialogDescription className='font-light'>
                서비스 이용을 위해 접속하세요!
              </DialogDescription>
            </DialogHeader>
            {open && (
              <SignupForm handleTarget={handleTarget} closeModal={closeModal} />
            )}
          </>
        )}

        {currentTarget === '로그인' && (
          <>
            <DialogHeader className='flex flex-col items-center gap-2'>
              <div className='flex justify-center items-center gap-1'>
                <Apple width={64} height={64} />
                <span className='text-2xl font-extrabold'>LOGO</span>
              </div>
              <DialogTitle className='text-3xl font-semibold md:font-bold'>
                계정 로그인
              </DialogTitle>
              <DialogDescription className='font-light'>
                서비스 이용을 위해 접속하세요!
              </DialogDescription>
            </DialogHeader>
            {open && (
              <SigininForm
                handleTarget={handleTarget}
                closeModal={closeModal}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
