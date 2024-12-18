import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserInfoDto } from '@/types/Dto'
import { useAuthStore } from '@/lib/zustand/store'
import { useUpdateUserInfo } from '@/lib/react-query/queries'
import { ProfileValidation } from '@/lib/validation'
import { toast } from '@/hooks/use-toast'
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

export default function ProfileEdit() {
  const navigate = useNavigate()
  const userinfo = useLocation().state as UserInfoDto
  const setUserInfo = useAuthStore((state) => state.setUserInfo)

  const { mutateAsync: updateUserInfoAsync } = useUpdateUserInfo()

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      email: userinfo.email,
      username: userinfo.username,
      nickname: userinfo.nickname,
    },
  })

  const handleSubmit = async (data: z.infer<typeof ProfileValidation>) => {
    const { nickname } = data

    await updateUserInfoAsync({
      username: userinfo.username,
      nickname,
    })
    setUserInfo({ ...userinfo, nickname })
    navigate(-1)
    toast({
      title: '유저정보를 변경하였습니다',
    })
  }

  return (
    <>
      <div className='w-full'>
        <div className='flex flex-col w-full'>
          <h2 className='text-3xl font-bold'>프로필 수정</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='mt-10 space-y-8'
            >
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>유저명</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
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
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-2'>
                <Button
                  type='button'
                  //   disabled={isLoadingUpdate}
                  onClick={() => navigate(-1)}
                  className='text-black bg-white hover:bg-white'
                >
                  취소
                </Button>
                <Button type='submit'>
                  저장
                  {/* {isLoadingUpdate ? <Loader /> : '저장'} */}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
