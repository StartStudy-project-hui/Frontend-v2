'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Lock, LoaderCircle, Mail } from 'lucide-react'

import { PasswordResetValidation } from '@/lib/validation'
import {
  useResetPassword,
  useSendPasswordResetCode,
  useVerifyEmailCode,
} from '@/lib/react-query/queries'
import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

type props = {
  handleTarget: (_target: '회원가입' | '로그인' | '비밀번호 찾기' | null) => void
}

export default function PasswordResetForm({ handleTarget }: props) {
  const { mutateAsync: sendCodeAsync, isPending: isSendingCode } =
    useSendPasswordResetCode()
  const { mutateAsync: verifyCodeAsync, isPending: isVerifyingCode } =
    useVerifyEmailCode()
  const { mutateAsync: resetPasswordAsync, isPending: isResetting } =
    useResetPassword()

  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  const form = useForm<z.infer<typeof PasswordResetValidation>>({
    resolver: zodResolver(PasswordResetValidation),
    defaultValues: {
      email: '',
      newPwd: '',
      newCheckPwd: '',
    },
  })

  const handleSendCode = async () => {
    const isEmailValid = await form.trigger('email')
    if (!isEmailValid) return

    const email = form.getValues('email')
    await sendCodeAsync({ email })
    setIsCodeSent(true)
    setCooldownSeconds(60)
  }

  const handleVerifyCode = async () => {
    const email = form.getValues('email')
    if (!/^[0-9]{6}$/.test(verificationCode)) {
      toast({ title: '인증번호는 6자리 숫자입니다.' })
      return
    }
    await verifyCodeAsync({ email, code: verificationCode })
    setIsVerified(true)
  }

  const handleResetPassword = async (
    data: z.infer<typeof PasswordResetValidation>
  ) => {
    await resetPasswordAsync(data)
    toast({ title: '비밀번호가 재설정되었습니다. 다시 로그인해주세요.' })
    handleTarget('로그인')
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center w-full'>
        <form
          onSubmit={form.handleSubmit(handleResetPassword)}
          className='flex flex-col gap-5 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  이메일
                </FormLabel>
                <div
                  className={cn(
                    'space-y-3 rounded-xl border p-3 transition-colors',
                    isVerified
                      ? 'border-green-200 bg-green-50/60'
                      : 'border-gray-200 bg-gray-50/60'
                  )}
                >
                  <div className='flex gap-2'>
                    <div className='relative flex-1'>
                      <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                      <FormControl>
                        <Input
                          type='text'
                          className='rounded-lg bg-white pl-9'
                          readOnly={isCodeSent}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='shrink-0 rounded-lg bg-white'
                      disabled={
                        isVerified || cooldownSeconds > 0 || isSendingCode
                      }
                      onClick={handleSendCode}
                    >
                      {isSendingCode ? (
                        <LoaderCircle className='h-4 w-4 animate-spin' />
                      ) : cooldownSeconds > 0 ? (
                        `재전송 (${cooldownSeconds}초)`
                      ) : isCodeSent ? (
                        '재전송'
                      ) : (
                        '인증번호 전송'
                      )}
                    </Button>
                  </div>

                  {isCodeSent && !isVerified && (
                    <div className='flex gap-2'>
                      <Input
                        type='text'
                        inputMode='numeric'
                        maxLength={6}
                        placeholder='인증번호 6자리'
                        className='rounded-lg bg-white text-center tracking-[0.3em]'
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='shrink-0 rounded-lg bg-white'
                        disabled={isVerifyingCode}
                        onClick={handleVerifyCode}
                      >
                        {isVerifyingCode ? (
                          <LoaderCircle className='h-4 w-4 animate-spin' />
                        ) : (
                          '확인'
                        )}
                      </Button>
                    </div>
                  )}

                  {isVerified && (
                    <div className='flex items-center gap-1.5 text-sm font-medium text-green-600'>
                      <CheckCircle2 className='h-4 w-4' />
                      이메일 인증이 완료되었습니다
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='newPwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  새 비밀번호
                </FormLabel>
                <div className='relative'>
                  <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='password'
                      className='rounded-xl pl-9'
                      disabled={!isVerified}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='newCheckPwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  새 비밀번호 확인
                </FormLabel>
                <div className='relative'>
                  <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='password'
                      className='rounded-xl pl-9'
                      disabled={!isVerified}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-2 flex flex-col gap-1.5'>
            <Button
              type='submit'
              className='h-11 rounded-xl font-semibold shadow-sm'
              disabled={!isVerified || isResetting}
            >
              {isResetting ? (
                <LoaderCircle className='h-4 w-4 animate-spin' />
              ) : (
                '비밀번호 재설정'
              )}
            </Button>
            {!isVerified && (
              <p className='text-center text-xs text-gray-400'>
                이메일 인증을 완료하면 재설정할 수 있어요
              </p>
            )}
          </div>

          <p className='text-small-regular text-light-2 text-center mt-1'>
            <button
              type='button'
              onClick={() => handleTarget('로그인')}
              className='ml-1 text-blue-500 underline font-semibold'
            >
              로그인으로 돌아가기
            </button>
          </p>
        </form>
      </div>
    </Form>
  )
}
