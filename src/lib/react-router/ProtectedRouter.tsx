import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/lib/zustand/store'
import { toast } from '@/hooks/use-toast'

export default function ProtectedRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: '로그인이 필요한 페이지 입니다',
      })
    }
  }, [])

  return isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}
