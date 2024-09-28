import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components'
import { useAuthStore } from '@/lib/zustand/store'
import { useEffect } from 'react'

export default function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userinfo = useAuthStore((state) => state.userinfo)
  const signout = useAuthStore((state) => state.signout)

  console.log('isAuth?', isAuthenticated)
  console.log('role', userinfo)
  const user = true
  const admin = true

  useEffect(() => {}, [])
  return (
    <header className='flex justify-between items-center p-5'>
      <div></div>
      <button onClick={() => navigate('/')} className=''>
        LOGO
      </button>
      <div className='flex gap-5 px-5'>
        {/* {!isAuthenticated && (
          <>
            <Modal target='회원가입'></Modal>
            <Modal target='로그인'></Modal>
          </>
        )}
        {!isAuthenticated && (
          <>
            {admin && (
              <>
                <button onClick={() => navigate('/admin/dashboard')}>
                  관리자페이지
                </button>
              </>
            )}
            <button onClick={() => navigate('/mypage/profile')}>
              마이페이지
            </button>
            <button onClick={signout}>로그아웃</button>
          </>
        )} */}
        <div className='flex gap-3'>
          <>
            <Modal target='회원가입'></Modal>
            <Modal target='로그인'></Modal>
            <>
              <button onClick={() => navigate('/admin/dashboard')}>
                관리자페이지
              </button>
            </>
            <button onClick={() => navigate('/mypage/profile')}>
              마이페이지
            </button>
            <button onClick={signout}>로그아웃</button>
          </>
        </div>
      </div>
    </header>
  )
}
