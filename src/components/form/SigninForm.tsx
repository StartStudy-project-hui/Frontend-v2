'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { SigninInfo } from '@/types/Dto'
import { useAuthStore } from '@/lib/zustand/store'
import { SigninValidation } from '@/lib/validation'
import { useGetUserInfo, useSignInAccount } from '@/lib/react-query/queries'
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

type props = {
  handleTarget: (_target: '회원가입' | '로그인' | null) => void
  closeModal: () => void
}

export default function SigninForm({ handleTarget, closeModal }: props) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUserInfo = useAuthStore((state) => state.setUserInfo)

  const { mutateAsync: signInAccountAsync } = useSignInAccount()
  const { refetch: fetchUserInfo } = useGetUserInfo(false)

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      pwd: '',
    },
  })

  const handleSignin = async (data: SigninInfo) => {
    await signInAccountAsync(data)
    const { data: userInfoData } = await fetchUserInfo()
    setUserInfo(userInfoData!)
    setIsAuthenticated({ isAuthenticated: true })
    closeModal()
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center sm:w-420'>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className='flex flex-col gap-5 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>이메일</FormLabel>
                <FormControl>
                  <Input type='email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='pwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>비밀번호</FormLabel>
                <FormControl>
                  <Input type='password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='shad-button_primary'>
            {/* {isSigningInUser || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader />
              </div>
            ) : (
              '로그인'
            )} */}
            로그인
          </Button>

          <a href='https://api.startstudy.shop/oauth2/authorization/kakao' className='shad-button_primary'>
            카카오 로그인
          </a>
          <a href='https://api.startstudy.shop/oauth2/authorization/naver' className='shad-button_primary'>
            네이버 로그인
          </a>
          <p className='text-small-regular text-light-2 text-center mt-2'>
            계정이 없나요?
            <button
              onClick={() => handleTarget('회원가입')}
              className='ml-1 text-blue-500 underline font-semibold'
            >
              회원가입
            </button>
          </p>
        </form>
      </div>
    </Form>
  )
}
