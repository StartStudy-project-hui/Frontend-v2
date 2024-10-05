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
    (set, get) => ({
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
          userinfo: {
            username: get().userinfo!.username,
            email,
            nickname,
            role,
          },
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

type TriggerStore = {
  trigger: boolean
  setTrigger: () => void
}

export const useTriggerStore = create<TriggerStore>((set) => ({
  trigger: false,
  setTrigger: () => {
    set((state) => ({ trigger: !state.trigger }))
  },
}))
