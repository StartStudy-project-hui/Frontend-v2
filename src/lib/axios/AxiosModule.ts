import { AxiosRequestConfig } from 'axios'
import {
  WritePostRequestDto,
  UserListRequestInfo,
  ModifyPostInfo,
  DeletePostInfo,
  ModifyUserInfo,
  ModifyRecruitInfo,
  SigninInfo,
  SignupInfo,
  BoardRequestDto,
  AddCommentRequestDto,
  EditCommentRequestDto,
} from '@/types/Dto'
import { getAccessToken, getRefreshToken } from '@/lib/utils'

const BASE_URL = import.meta.env.VITE_BASE_URL

const publicConfig = (_config: AxiosRequestConfig) => {
  const config = {
    ..._config,
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return config
}

const userConfig = (_config: AxiosRequestConfig) => {
  const refresh = getRefreshToken()
  const access = getAccessToken()

  const config = {
    ..._config,
    baseURL: BASE_URL,
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return config
}

// ==============================
/* 로그인/로그아웃/회원가입 기능 */
// ==============================
export const createSignupConfig = (data: SignupInfo) => {
  const config = publicConfig({
    url: '/sign',
    method: 'POST',
    data,
  })

  return config
}

export const createSigninConfig = (data: SigninInfo): AxiosRequestConfig => {
  const config = publicConfig({
    url: '/login',
    method: 'POST',
    data,
  })

  return config
}

export const createLogOutConfig = () => {
  const config = userConfig({
    url: '/service-logout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return config
}

// ==============================
/* 메인 기능 구현 */
// ==============================
export const createMainlistConfig = (
  requestBody: BoardRequestDto
): AxiosRequestConfig => {
  const { category, order, page, title } = requestBody
  const config = publicConfig({
    url: '/',
    method: 'GET',
    params: {
      category,
      order,
      page,
      title,
    },
    withCredentials: true,
  })

  return config
}

// ==============================
/* 게시판 API */
// ==============================
export const createWriteConfig = (data: WritePostRequestDto) => {
  const config = userConfig({
    url: '/board/member',
    method: 'POST',
    data,
  })

  return config
}

export const createReadPostConfig = (boardId: string) => {
  const config = publicConfig({
    url: `/board/${boardId}`,
    method: 'GET',
  })

  return config
}

export const createModifyPostConfig = (data: ModifyPostInfo) => {
  const config = userConfig({
    url: `/board/member`,
    method: 'PATCH',
    data,
  })

  return config
}

export const createModifyRecruitConfig = (data: ModifyRecruitInfo) => {
  const config = userConfig({
    url: `/board/member/recurit/${data.boardId}`,
    method: 'PATCH',
    data: data.recruit,
  })
  return config
}

export const createRemovePostConfig = (requestBody: DeletePostInfo) => {
  const { boardId } = requestBody

  const config = userConfig({
    url: `/board/member/${boardId}`,
    method: 'DELETE',
    params: requestBody,
  })

  return config
}

// ==============================
/* 마이페이지 기능 */
// ==============================
export const createUserPostConfig = (data: UserListRequestInfo) => {
  const { recruit, category, order } = data
  const config = userConfig({
    url: `/user/lists`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
    },
  })

  return config
}

export const createGetUserInfoConfig = () => {
  const config = userConfig({
    url: `/user/info`,
    method: 'GET',
  })

  return config
}

export const createModifyUserInfoConfig = (data: ModifyUserInfo) => {
  const config = userConfig({
    url: `/user/info`,
    method: 'PATCH',
    data,
  })

  return config
}

export const createMyLikePostConfig = (data: UserListRequestInfo) => {
  const { recruit, category, order } = data
  const config = userConfig({
    url: `/user/post-likes`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
    },
  })

  return config
}

// ==============================
/* 댓글 기능 구현 */
// ==============================
export const createAddCommentConfig = (data: AddCommentRequestDto) => {
  const config = userConfig({
    url: `/reply`,
    method: 'POST',
    data,
  })

  return config
}

export const createEditCommentConfig = (data: EditCommentRequestDto) => {
  const config = userConfig({
    url: `/reply`,
    method: 'PATCH',
    data,
  })

  return config
}

export const createDeleteCommentConfig = (requestBody: string) => {
  const config = userConfig({
    url: `/reply/${requestBody}`,
    method: 'DELETE',
    params: {
      rno: requestBody,
    },
  })

  return config
}

// ==============================
/* 사용자 관심 글 */
// ==============================
export const createPostLikePostConfig = (boardId: string) => {
  const config = userConfig({
    url: `/post-like/${boardId}`,
    method: 'POST',
  })

  return config
}

export const DeleteLikePostConfig = (postLikeId: string) => {
  const config = userConfig({
    url: `/post-like/${postLikeId}`,
    method: 'DELETE',
  })

  return config
}

// ==============================
/* 관리자 기능 */
// ==============================
export const createGetAllUsersInfoConfig = (username?: string) => {
  const config = userConfig({
    url: `/admin/user-all`,
    method: 'GET',
    params: {
      username: username,
    },
  })

  return config
}

export const createGetAllUsersPostConfig = (data: UserListRequestInfo) => {
  const { recruit, category, order } = data
  const config = userConfig({
    url: `/admin/dash-board`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
    },
  })
  return config
}

export const createAdminRemovePostConfig = (boardId: string) => {
  const config = userConfig({
    url: `/admin/board/${boardId}?role=ROLE_ADMIN`,
    method: 'DELETE',
  })

  return config
}
