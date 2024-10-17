import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/lib/zustand/store'
import { Modal } from '@/components'

export default function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userInfo = useAuthStore((state) => state.userinfo)
  const clearAuthStore = useAuthStore((state) => state.clearAuthStore)

  const handleSignOut = async () => {
    clearAuthStore()
  }

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
