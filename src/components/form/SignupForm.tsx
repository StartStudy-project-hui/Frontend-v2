'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { SignupRequestDto } from '@/types/Dto'
import { useAuthStore } from '@/lib/zustand/store'
import { SignupValidation } from '@/lib/validation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Loader } from '@/components/index'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui'
import {
  useGetUserInfo,
  useSignInAccount,
  useSignUpAccount,
} from '@/lib/react-query/queries'

type props = {
  handleTarget: (_target: '회원가입' | '로그인' | null) => void
  closeModal: () => void
}

export default function SignupForm({ handleTarget, closeModal }: props) {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUserInfo = useAuthStore((state) => state.setUserInfo)

  const { mutateAsync: signUpAccountAsync, isPending: isSigningUp } =
    useSignUpAccount()
  const { mutateAsync: signInAccountAsync, isPending: isSigningIn } =
    useSignInAccount()
  const { isPending: isGettingUserInfo, refetch: fetchUserInfo } =
    useGetUserInfo(false)

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      email: '',
      pwd: '',
      checkPwd: '',
    },
  })

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
      <div className='flex flex-col items-center sm:w-420'>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className='flex flex-col gap-2 w-full min-w-[360px]'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>이름</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>이메일</FormLabel>
                <FormControl>
                  <Input type='text' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='nickname'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>닉네임</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
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
          <FormField
            control={form.control}
            name='checkPwd'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>비밀번호 확인</FormLabel>
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
            회원가입
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            계정이 있나요?
            <button
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
