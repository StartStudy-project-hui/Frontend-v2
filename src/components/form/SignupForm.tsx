'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, CheckCircle2, Lock, LoaderCircle, Mail, User } from 'lucide-react'

import { SignupRequestDto } from '@/types/Dto'
import { useAuthStore } from '@/lib/zustand/store'
import { SignupValidation } from '@/lib/validation'
import { cn } from '@/lib/utils'
import {
  useGetUserInfo,
  useSendVerificationCode,
  useSignInAccount,
  useSignUpAccount,
  useVerifyEmailCode,
} from '@/lib/react-query/queries'
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
  handleTarget: (_target: '회원가입' | '로그인' | null) => void
  closeModal: () => void
}

export default function SignupForm({ handleTarget, closeModal }: props) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUserInfo = useAuthStore((state) => state.setUserInfo)

  const { mutateAsync: signUpAccountAsync, isPending: isSigningUp } =
    useSignUpAccount()
  const { mutateAsync: signInAccountAsync } = useSignInAccount()
  const { refetch: fetchUserInfo } = useGetUserInfo(false)
  const { mutateAsync: sendCodeAsync, isPending: isSendingCode } =
    useSendVerificationCode()
  const { mutateAsync: verifyCodeAsync, isPending: isVerifyingCode } =
    useVerifyEmailCode()

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

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      email: '',
      pwd: '',
      checkPwd: '',
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

  const handleSignup = async (data: SignupRequestDto) => {
    const { email, pwd } = data
    await signUpAccountAsync(data)
    await signInAccountAsync({ email, pwd })
    const { data: userInfoData } = await fetchUserInfo()
    setUserInfo(userInfoData!)
    setIsAuthenticated({ isAuthenticated: true })
    closeModal()
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center w-full'>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className='flex flex-col gap-5 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  이름
                </FormLabel>
                <div className='relative'>
                  <User className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='text'
                      className='rounded-xl pl-9'
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
            name='nickname'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  닉네임
                </FormLabel>
                <div className='relative'>
                  <AtSign className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='text'
                      className='rounded-xl pl-9'
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
            name='pwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  비밀번호
                </FormLabel>
                <div className='relative'>
                  <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='password'
                      className='rounded-xl pl-9'
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
            name='checkPwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm font-medium text-gray-700'>
                  비밀번호 확인
                </FormLabel>
                <div className='relative'>
                  <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  <FormControl>
                    <Input
                      type='password'
                      className='rounded-xl pl-9'
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
              disabled={!isVerified || isSigningUp}
            >
              {isSigningUp ? (
                <LoaderCircle className='h-4 w-4 animate-spin' />
              ) : (
                '회원가입'
              )}
            </Button>
            {!isVerified && (
              <p className='text-center text-xs text-gray-400'>
                이메일 인증을 완료하면 가입할 수 있어요
              </p>
            )}
          </div>

          <p className='text-small-regular text-light-2 text-center mt-1'>
            계정이 있나요?
            <button
              type='button'
              onClick={() => handleTarget('로그인')}
              className='ml-1 text-blue-500 underline font-semibold'
            >
              로그인
            </button>
          </p>
        </form>
      </div>
    </Form>
  )
}
