import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { UserInfoDto } from '@/types/Dto'
import { removeAccessToken, removeRefreshToken } from '@/lib/utils'

type AuthStore = {
  isAuthenticated: boolean
  userinfo: UserInfoDto | null
  setIsAuthenticated: ({
    isAuthenticated,
  }: {
    isAuthenticated: boolean
  }) => void
  setUserInfo: ({ username, email, nickname, role, socialType }: UserInfoDto) => void
  clearAuthStore: () => void
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
        socialType: '',
      },
      setIsAuthenticated: ({ isAuthenticated }) => {
        set({ isAuthenticated })
      },
      setUserInfo: ({ username, email, nickname, role, socialType }) => {
        set({
          userinfo: {
            username,
            email,
            nickname,
            role,
            socialType,
          },
        })
      },
      clearAuthStore: () => {
        removeAccessToken()
        removeRefreshToken()
        set({
          isAuthenticated: false,
          userinfo: null,
        })
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
