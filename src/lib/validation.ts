import * as z from 'zod'

export const SignupValidation = z.object({
  name: z.string().min(2, { message: '이름은 최소 두글자입니다.' }),
  email: z.string().email('유효한 이메일이 아닙니다.'),
  pwd: z.string().min(8, { message: '비밀번호는 최소 8글자입니다.' }),
  checkPwd: z.string().min(8, { message: '비밀번호는 최소 8글자입니다.' }),
})

export const SigninValidation = z.object({
  email: z.string().email('유효한 이메일이 아닙니다.'),
  pwd: z.string().min(4, { message: '비밀번호는 최소 4글자입니다.' }),
})

export const ProfileValidation = z.object({
  email: z.string().email('유효한 이메일이 아닙니다.'),
  username: z.string(),
  nickname: z.string().min(1, { message: '닉네임은 최소 2글자입니다.' }),
})
