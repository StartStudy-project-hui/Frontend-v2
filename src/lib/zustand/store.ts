import { removeAccessToken, removeRefreshToken } from '@/lib/utils'
import { UserInfoDto } from '@/types/Dto'
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
  setUserInfo: ({ username, email, nickname, role }: UserInfoDto) => void
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
      },
      setIsAuthenticated: ({ isAuthenticated }) => {
        set({ isAuthenticated })
      },
      setUserInfo: ({ username, email, nickname, role }) => {
        set({
          userinfo: {
            username,
            email,
            nickname,
            role,
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
