import Cookie from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

import { useAuthStore } from '@/lib/zustand/store'
import { Modal } from '@/components'
import { useGetUserInfo } from '@/lib/react-query/queries'
import { setAccessToken, setRefreshToken } from '@/lib/utils';

export default function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userInfo = useAuthStore((state) => state.userinfo)
  const clearAuthStore = useAuthStore((state) => state.clearAuthStore)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUserInfo = useAuthStore((state) => state.setUserInfo)

  const { refetch: fetchUserInfo } = useGetUserInfo(false)

  const handleSignOut = async () => {
    clearAuthStore()
  }
    
  const handleLoginCheck = async () => {
    const accessToken = Cookie.get("Access_Token");
    const refreshToken = Cookie.get("Refresh_Token");

    console.log(accessToken, refreshToken);

    if (accessToken && refreshToken) {
      setAccessToken('Bearer ' + accessToken);
      setRefreshToken('Bearer ' + refreshToken);

      localStorage.setItem('accessToken', 'Bearer ' + accessToken)
      localStorage.setItem('refreshToken', 'Bearer ' + refreshToken)

      const { data: userInfoData } = await fetchUserInfo()
      setUserInfo(userInfoData!)
      setIsAuthenticated({ isAuthenticated: true })
    }
  }

  useEffect(() => {
    handleLoginCheck()
  }, []); 
  return (
    <header className='sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm'>
      <div className='mx-auto flex max-w-5xl items-center justify-between px-6 py-3'>
        <Link to={'/'} className='flex items-center'>
          <img src='/logo.png' className='h-9 w-auto' />
        </Link>
        <div className='flex items-center gap-1 text-sm font-medium text-gray-500'>
          {!isAuthenticated && (
            <>
              <Modal target='회원가입'></Modal>
              <Modal target='로그인'></Modal>
            </>
          )}
          {isAuthenticated && (
            <>
              {userInfo?.role === 'ROLE_ADMIN' && (
                <button
                  className='rounded-md px-3 py-2 transition-colors hover:bg-gray-50 hover:text-gray-900'
                  onClick={() => navigate('/admin/dashboard')}
                >
                  관리자페이지
                </button>
              )}
              <button
                className='rounded-md px-3 py-2 transition-colors hover:bg-gray-50 hover:text-gray-900'
                onClick={() => navigate('/mypage/profile')}
              >
                마이페이지
              </button>
              <button
                className='rounded-md px-3 py-2 transition-colors hover:bg-gray-50 hover:text-gray-900'
                onClick={handleSignOut}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
