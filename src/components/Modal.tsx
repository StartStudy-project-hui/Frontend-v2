import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SigininForm, SignupForm } from '@/components/form'

type props = {
  target?: '회원가입' | '로그인' | null
}

function AuthModalHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <DialogHeader className='flex flex-col items-center gap-3'>
      <img src='/logo.png' className='h-10 w-auto' alt='Start Study' />
      <div className='flex flex-col items-center gap-1'>
        <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
        <DialogDescription className='text-sm font-normal text-gray-500'>
          {description}
        </DialogDescription>
      </div>
    </DialogHeader>
  )
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
      <DialogTrigger className='rounded-md px-3 py-2 transition-colors hover:bg-gray-50 hover:text-gray-900'>
        {target}
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        {currentTarget === '회원가입' && (
          <>
            <AuthModalHeader
              title='회원가입'
              description='서비스 이용을 위해 접속하세요!'
            />
            {open && (
              <SignupForm handleTarget={handleTarget} closeModal={closeModal} />
            )}
          </>
        )}

        {currentTarget === '로그인' && (
          <>
            <AuthModalHeader
              title='계정 로그인'
              description='서비스 이용을 위해 접속하세요!'
            />
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
