import axios, { AxiosRequestConfig } from 'axios'
import {
  WritePostRequestDto,
  UserListRequestInfo,
  ModifyPostInfo,
  DeletePostInfo,
  ModifyUserInfo,
  AddParentCommentInfo,
  AddChildCommentInfo,
  ModifyCommentInfo,
  ModifyRecruitInfo,
  SigninInfo,
  SignupInfo,
  BoardRequestDto,
} from '@/types/Dto'
import { getAccessToken, getRefreshToken } from '@/lib/utils'

const BASE_URL = import.meta.env.VITE_BASE_URL

export type ConfigType = {
  method: string
  url: string
  params?: { [key: string]: any }
  data?: { [key: string]: any }
  headers?: any
}

export type AwaitApiType<T> = {
  success: boolean
  message: string
  data: T
  total?: number
}

export type HeadersType = {
  [key: string]: any
}

export type AwaitApiResponseType<T> = {
  success: boolean
  result: AwaitApiType<T> | null
  error: any
  headers?: HeadersType
}

export const authInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

const awaitApi = async (
  _config: ConfigType
): Promise<AwaitApiResponseType<any>> => {
  try {
    const response = await authInstance({
      baseURL: BASE_URL,
      ..._config,
    })
    return {
      success: true,
      result: response.data,
      error: false,
      headers: response.headers,
    }
  } catch (e) {
    return {
      success: false,
      result: null,
      error: e,
    }
  }
}

// ==============================
/* 로그인/로그아웃/회원가입 기능 */
// ==============================
export const createSignupConfig = (
  requestBody: SignupInfo
): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: '/sign',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  }

  return config
}

export const createSigninConfig = (
  requestBody: SigninInfo
): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
    withCredentials: true,
  }

  return config
}

export const createLogOutConfig = (): AxiosRequestConfig => {
  const refresh = getRefreshToken()
  const access = getAccessToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: '/service-logout',
    method: 'POST',
    headers: {
      Access_Token: access,
      'Refresh-Token': refresh,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

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
export const createWriteConfig = (
  requestBody: WritePostRequestDto
): AxiosRequestConfig => {
  const refresh = getRefreshToken()
  const access = getAccessToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: '/board/member',
    method: 'POST',
    headers: {
      Access_Token: access,
      'Refresh-Token': refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody,
  }

  return config
}

export const createReadPostConfig = (boardId: string): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/board/${boardId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return config
}

export const createModifyPostConfig = (
  requestBody: ModifyPostInfo
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/board/member`,
    method: 'PATCH',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody,
    withCredentials: true,
  }

  return config
}

export const createModifyRecruitConfig = (
  requestBody: ModifyRecruitInfo
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/board/member/recurit/${requestBody.boardId}`,
    method: 'PATCH',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody.recruit,
    withCredentials: true,
  }
  return config
}

export const createRemovePostConfig = (
  requestBody: DeletePostInfo
): AxiosRequestConfig => {
  const { boardId } = requestBody
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/board/member/${boardId}`,
    method: 'DELETE',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: requestBody,
    withCredentials: true,
  }

  return config
}

// ==============================
/* 마이페이지 기능 */
// ==============================
export const createUserPostConfig = (
  requestBody: UserListRequestInfo
): AxiosRequestConfig => {
  const { recruit, category, order } = requestBody
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/user/lists`,
    method: 'GET',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      recruit,
      category,
      order,
    },
    withCredentials: true,
  }

  return config
}

export const createGetUserInfoConfig = (): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/user/info`,
    method: 'GET',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return config
}

export const createModifyUserInfoConfig = (
  requestBody: ModifyUserInfo
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/user/info`,
    method: 'PATCH',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody,
    withCredentials: true,
  }

  return config
}

export const createMyLikePostConfig = (
  requestBody: UserListRequestInfo
): AxiosRequestConfig => {
  const { recruit, category, order } = requestBody
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/user/post-likes`,
    method: 'GET',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      recruit,
      category,
      order,
    },
    withCredentials: true,
  }

  return config
}

// ==============================
/* 댓글 기능 구현 */
// ==============================
export const createAddCommentConfig = (
  requestBody: AddChildCommentInfo | AddParentCommentInfo
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/reply`,
    method: 'POST',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody,
  }

  return config
}

export const createModifyCommentConfig = (
  requestBody: ModifyCommentInfo
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/reply`,
    method: 'PATCH',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    data: requestBody,
    withCredentials: true,
  }

  return config
}

export const createDeleteCommentConfig = (
  requestBody: string
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/reply/${requestBody}`,
    method: 'DELETE',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      rno: requestBody,
    },
    withCredentials: true,
  }

  return config
}

export const deleteComment = async (replyId: number) => {
  const access = getAccessToken()
  const refresh = getRefreshToken()

  return awaitApi({
    method: 'DELETE',
    url: `/reply/${replyId}`,
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      rno: replyId.toString(),
    },
  })
}

// ==============================
/* 사용자 관심 글 */
// ==============================
export const createPostLikePostConfig = (
  boardId: string
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/post-like/${boardId}`,
    method: 'POST',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return config
}

export const DeleteLikePostConfig = (
  postLikeId: string
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/post-like/${postLikeId}`,
    method: 'DELETE',
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
/* 관리자 기능 */
// ==============================
export const createGetAllUsersInfoConfig = (
  username?: string
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/admin/user-all`,
    method: 'GET',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      username: username,
    },
    withCredentials: true,
  }

  return config
}

export const createGetAllUsersPostConfig = (
  requestBody: UserListRequestInfo
): AxiosRequestConfig => {
  const { recruit, category, order } = requestBody
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/admin/dash-board`,
    method: 'GET',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    params: {
      recruit,
      category,
      order,
    },
    withCredentials: true,
  }
  return config
}

export const createAdminRemovePostConfig = (
  boardId: string
): AxiosRequestConfig => {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url: `/admin/board/${boardId}?role=ROLE_ADMIN`,
    method: 'DELETE',
    headers: {
      Access_Token: access,
      Refresh_Token: refresh,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }

  return config
}
