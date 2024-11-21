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

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      const { data: userInfoData } = await fetchUserInfo()
      setUserInfo(userInfoData!)
      setIsAuthenticated({ isAuthenticated: true })
    }
  }

  useEffect(() => {
    handleLoginCheck()
  }); 
  return (
    <header className='flex justify-between items-center px-5 py-3'>
      <div></div>
      <Link to={'/'}>
        <img src='/logo.png' className='w-[150px] h-[50px]' />
      </Link>
      <div className='flex gap-5 px-5'>
        {!isAuthenticated && (
          <>
            <Modal target='회원가입'></Modal>
            <Modal target='로그인'></Modal>
          </>
        )}
        {isAuthenticated && (
          <>
            {userInfo?.role === 'ROLE_ADMIN' && (
              <>
                <button onClick={() => navigate('/admin/dashboard')}>
                  관리자페이지
                </button>
              </>
            )}
            <button onClick={() => navigate('/mypage/profile')}>
              마이페이지
            </button>
            <button onClick={handleSignOut}>로그아웃</button>
          </>
        )}
      </div>
    </header>
  )
}
