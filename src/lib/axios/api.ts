import axios, { AxiosRequestConfig } from 'axios'

import {
  WritePostRequestDto,
  UserListRequestInfo,
  ModifyPostInfo,
  DeletePostInfo,
  ModifyUserInfo,
  ModifyRecruitInfo,
  SigninInfo,
  SignupRequestDto,
  BoardRequestDto,
  AddCommentRequestDto,
  EditCommentRequestDto,
  BoardResponseDto,
  UserResponseDto,
  UserInfoDto,
  BoardDetailDto,
} from '@/types/Dto'
import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/utils'
import { useAuthStore } from '@/lib/zustand/store'
import Cookies from 'js-cookie'

const BASE_URL = import.meta.env.VITE_BASE_URL

axios.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      try {
        const res = await renewToken()
        const accessToken = res.headers.access_token
        setAccessToken(accessToken)
        const config = error.config
        return axios(userConfig(config))
      } catch (error) {
        Cookies.remove('Access_Token');
        Cookies.remove('Refresh_Token');
        useAuthStore.getState().clearAuthStore()
        location.href = '/'
        return Promise.reject(error)
      }
    }
  }
)

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
/* 토큰 재발급 */
// ==============================
export const renewToken = async () => {
  const config = userConfig({
    url: '/renew-token',
    method: 'POST',
  })
  const axiosInstance = axios.create()
  const res = await axiosInstance(config)
  return res
}

// ==============================
/* 사용자 인증 */
// ==============================
export const signUpAccount = async (data: SignupRequestDto) => {
  const config = publicConfig({
    url: ' /api/v1/auth/sign',
    method: 'POST',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const signInAccount = async (data: SigninInfo) => {
  const config = publicConfig({
    url: ' /api/v1/auth/login',
    method: 'POST',
    data,
  })
  const res = await axios(config)
  removeAccessToken()
  removeRefreshToken()
  const accessToken = res.headers['access_token']
  const refreshToken = res.headers['refresh_token']
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  return res.data
}

export const signOutAccount = async () => {
  const config = userConfig({
    url: ' /api/v1/auth/service-logout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const res = await axios(config)
  removeAccessToken()
  removeRefreshToken()

  return res.data
}

// ==============================
/* 메인 게시글 리스트 */
// ==============================
export const getPosts = async (
  requestBody: BoardRequestDto
): Promise<BoardResponseDto> => {
  const { category, order, page, title, connectionType } = requestBody

  const config = publicConfig({
    url: '/api/v1/',
    method: 'GET',
    params: {
      category,
      order,
      connectionType,
      page,
      title,
    },
  })
  const res = await axios(config)
  return res.data
}

// ==============================
/* 게시글 */
// ==============================
export const createPost = async (data: WritePostRequestDto) => {
  const config = userConfig({
    url: '/api/v1/board/member',
    method: 'POST',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const getPostById = async (
  boardId?: string
): Promise<BoardDetailDto> => {
  const config = userConfig({
    url: `/api/v1/board/${boardId}`,
    method: 'GET',
  })
  const res = await axios(config)
  return res.data
}

export const updatePost = async (data: ModifyPostInfo) => {
  const config = userConfig({
    url: `/api/v1/board/member`,
    method: 'PATCH',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const updateRecruit = async (data: ModifyRecruitInfo) => {
  const config = userConfig({
    url: `/api/v1/board/member/recruit/${data.boardId}`,
    method: 'PATCH',
    data: data.recruit,
  })
  const res = await axios(config)
  return res.data
}

export const deletePost = async (requestBody: DeletePostInfo) => {
  const { boardId } = requestBody

  const config = userConfig({
    url: `/api/v1/board/member/${boardId}`,
    method: 'DELETE',
    params: requestBody,
  })
  const res = await axios(config)
  return res.data
}

// ==============================
/* 마이페이지 */
// ==============================
export const getUserPosts = async (
  data: UserListRequestInfo
): Promise<BoardResponseDto> => {
  const { recruit, category, order, page, connectionType } = data
  const config = userConfig({
    url: `/api/v1/user/lists`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
      connectionType,
      page,
    },
  })
  const res = await axios(config)
  return res.data
}

export const getUserInfo = async (): Promise<UserInfoDto> => {
  const config = userConfig({
    url: `/api/v1/user/info`,
    method: 'GET',
  })
  const res = await axios(config)
  return res.data
}

export const updateUserInfo = async (data: ModifyUserInfo) => {
  const config = userConfig({
    url: `/api/v1/user/info`,
    method: 'PATCH',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const getLikedPosts = async (
  data: UserListRequestInfo
): Promise<BoardResponseDto> => {
  const { recruit, category, order, page, connectionType } = data
  const config = userConfig({
    url: `/api/v1/user/post-likes`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
      connectionType,
      page,
    },
  })
  const res = await axios(config)
  return res.data
}

// ==============================
/* 댓글 */
// ==============================
export const getCommentByBoardId = async (boardId: string) => {
  const config = userConfig({
    url: `/api/v1/reply/view/${boardId}`,
    method: 'GET',
  })
  const res = await axios(config)
  return res.data
}
export const createComment = async (data: AddCommentRequestDto) => {
  const config = userConfig({
    url: `/api/v1/reply`,
    method: 'POST',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const updateComment = async (data: EditCommentRequestDto) => {
  const config = userConfig({
    url: `/api/v1/reply`,
    method: 'PATCH',
    data,
  })
  const res = await axios(config)
  return res.data
}

export const deleteCommentById = async (replyId: string) => {
  const config = userConfig({
    url: `/api/v1/reply/${replyId}`,
    method: 'DELETE',
    params: {
      rno: replyId,
    },
  })
  const res = await axios(config)
  return res.data
}

// ==============================
/* 관심글 등록 */
// ==============================
export const likePostById = async (boardId: string, signal: AbortSignal) => {
  const config = userConfig({
    url: `/api/v1/post-like/${boardId}`,
    method: 'POST',
  })
  const res = await axios({ ...config, signal })
  return res.data
}

export const unlikePostById = async (
  postLikeId: string,
  signal: AbortSignal
) => {
  const config = userConfig({
    url: `/api/v1/post-like/${postLikeId}`,
    method: 'DELETE',
  })
  const res = await axios({ ...config, signal })
  return res.data
}

// ==============================
/* 관리자 */
// ==============================
export const getUsersInfoFromAdmin = async ({
  username,
  page,
}: {
  username?: string
  page?: string
}): Promise<UserResponseDto> => {
  const config = userConfig({
    url: `/api/v1/admin/user-all`,
    method: 'GET',
    params: {
      username,
      page,
    },
  })
  const res = await axios(config)
  return res.data
}

export const getAdminDashboard = async (data: UserListRequestInfo) => {
  const { recruit, category, order } = data
  userConfig({
    url: `/api/v1/admin/dash-board`,
    method: 'GET',
    params: {
      recruit,
      category,
      order,
    },
  })
}

export const deletePostFromAdmin = async (boardId: string) => {
  const config = userConfig({
    url: `/api/v1/admin/board/${boardId}?role=ROLE_ADMIN`,
    method: 'DELETE',
  })
  const res = await axios(config)
  return res.data
}
