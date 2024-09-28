import {
  createGetUserInfoConfig,
  createSigninConfig,
} from '@/lib/axios/AxiosModule'
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/utils'
import { SigninInfo, UserInfoDto } from '@/types/Dto'
import axios, { AxiosResponse } from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  isAuthenticated: boolean
  userinfo: UserInfoDto | null
  setIsAuthenticated: ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean
  }) => void
  setUserInfo: ({ email, nickname, role }: UserInfoDto) => void
  signin: ({ email, pwd }: SigninInfo) => Promise<AxiosResponse>
  signout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userinfo: {
        username: '',
        nickname: '',
        email: '',
        role: '',
      },
      setIsAuthenticated: ({ isAuthenticated }) => {
        set({ isAuthenticated })
      },
      setUserInfo: ({ email, nickname, role }) => {
        set({
          userinfo: { username: '', email, nickname, role },
        })
      },
      signin: async ({ email, pwd }) => {
        const config = createSigninConfig({ email, pwd })
        const res = await axios(config)

        if (res.data.statusCode === 200) {
          removeAccessToken()
          removeRefreshToken()
          const accessToken = res.headers['access_token']
          const refreshToken = res.headers['refresh_token']
          setAccessToken(accessToken)
          setRefreshToken(refreshToken)

          // 유저정보 가져오기
          const userInfoConfig = createGetUserInfoConfig()
          const userInfoRes = await axios(userInfoConfig)
          const { username, email, nickname, role } = userInfoRes.data
          const userinfo = { username, email, nickname, role }
          console.log(userinfo)
          set({
            isAuthenticated: true,
            userinfo,
          })
        }
        return res
      },
      signout: () => {
        removeAccessToken()
        removeRefreshToken()
        set({ userinfo: null })
        set({ isAuthenticated: false })
      },
    }),
    { name: 'user-storage' }
  )
)
// export const useAuthStore = create<AuthStore>(
//   persist(
//     (set) => ({
//       isAuthenticated: false,
//       email: '',
//       nickname: '',
//       role: '',
//       setIsAuthenticated: ({ isAuthenticated }) => {
//         set({ isAuthenticated })
//       },
//       setUserInfo: ({ email, nickname, role }) => {
//         set({
//           email,
//           nickname,
//           role,
//         })
//       },
//       signin: async ({ email, pwd }) => {
//         const config = createSigninConfig({ email, pwd })
//         const res = await axios(config)
//         console.log(res)

//         if (res.data.statusCode === 200) {
//           removeAccessToken()
//           removeRefreshToken()
//           const accessToken = res.headers['access_token']
//           const refreshToken = res.headers['refresh_token']
//           console.log('accessToken', accessToken)
//           console.log('refreshToken', refreshToken)
//           setAccessToken(accessToken)
//           setRefreshToken(refreshToken)

//           const { email, nickname, role } = res.data
//           set({ isAuthenticated: true, email, nickname, role })
//         }
//         return res
//       },
//     }),
//     {
//       name: 'user-storage',
//     }
//   )
// )

// type AuthStore = {
//   isLogin: boolean
//   email: string
//   login: (loginInfo: LoginInfo) => void
//   logout: () => void
//   role: 'admin' | 'user' | undefined
//   setAuth: ({ email, nickname }: { email: string; nickname: string }) => void
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//   isLogin: false,
//   email: 'abcd1234@naver.com',
//   role: undefined,
//   setAuth: ({ email, nickname }) => {
//     set({ isLogin: true, email, role: getRole(nickname) })
//   },
//   login: async (loginInfo: LoginInfo) => {
//     const config = createLoginConfig(loginInfo)
//     try {
//       const response = await axios(config)
//       console.log(response.data)
//       if (response.data.statusCode === 200) {
//         removeAccessToken()
//         removeRefreshToken()
//         const accessToken = response.headers['access_token']
//         console.log('accessToken', accessToken)
//         const refreshToken = response.headers['refresh_token']
//         console.log('refreshToken', refreshToken)
//         setAccessToken(accessToken)
//         setRefreshToken(refreshToken)

//         const nickName = response.data.nickname
//         setNickName(nickName)

//         set({ role: getRole(nickName) })
//         set({ isLogin: true })
//       }
//     } catch (error: unknown) {
//       console.log(error)
//     }
//   },
//   logout: () => {
//     removeAccessToken()
//     removeRefreshToken()
//     set({ role: undefined })
//     set({ isLogin: false })
//   },
// }))

// const getRole = (role: string) => {
//   if (role === 'admin') {
//     return 'admin'
//   } else {
//     return 'user'
//   }
// }
