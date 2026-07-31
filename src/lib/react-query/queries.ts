import { useMutation, useQuery } from '@tanstack/react-query'

import {
  AddCommentRequestDto,
  BoardRequestDto,
  DeletePostInfo,
  EditCommentRequestDto,
  ModifyPostInfo,
  ModifyRecruitInfo,
  ModifyUserInfo,
  SigninInfo,
  SignupRequestDto,
  UserListRequestInfo,
  WritePostRequestDto,
  BlacklistCreateRequestDto,
  BlacklistUpdateRequestDto,
  BlacklistListRequestDto,
  BlacklistHistoryListRequestDto,
  BlacklistHistoryByTargetRequestDto,
} from '@/types/Dto'
import {
  createComment,
  createPost,
  deleteCommentById,
  deletePost,
  deletePostFromAdmin,
  getAdminDashboard,
  getCommentByBoardId,
  getLikedPosts,
  getPostById,
  getPostLikeStatus,
  getPosts,
  increaseViewCount,
  getUserInfo,
  getUserPosts,
  getUsersInfoFromAdmin,
  likePostById,
  signInAccount,
  signOutAccount,
  signUpAccount,
  unlikePostById,
  updateComment,
  updatePost,
  updateRecruit,
  updateUserInfo,
  getBlacklistPage,
  registerBlacklist,
  updateBlacklist,
  deleteBlacklist,
  makeBlacklistPermanent,
  getBlacklistHistoryPage,
  getBlacklistHistoryByTarget,
  getMyBlacklistHistory,
} from '@/lib/axios/api'
import { QUERY_KEYS } from '@/lib/react-query/queryKeys'

export const useSignUpAccount = () => {
  return useMutation({
    mutationFn: (data: SignupRequestDto) => signUpAccount(data),
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (data: SigninInfo) => signInAccount(data),
  })
}

export const useSingoutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  })
}

export const useGetPosts = (requestBody: BoardRequestDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: () => getPosts(requestBody),
    enabled: false,
  })
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (data: WritePostRequestDto) => createPost(data),
  })
}

export const useGetPostById = (boardId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(boardId),
    enabled: false,
  })
}

export const useIncreaseViewCount = () => {
  return useMutation({
    mutationFn: (boardId: string) => increaseViewCount(boardId),
  })
}

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: (data: ModifyPostInfo) => updatePost(data),
  })
}

export const useUpdateRecruit = () => {
  return useMutation({
    mutationFn: (data: ModifyRecruitInfo) => updateRecruit(data),
  })
}

export const useDeletePost = () => {
  return useMutation({
    mutationFn: (requestBody: DeletePostInfo) => deletePost(requestBody),
  })
}

export const useGetUserPosts = (data: UserListRequestInfo) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS],
    queryFn: () => getUserPosts(data),
    enabled: false,
  })
}

export const useGetUserInfo = (fetchOnMount?: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_INFO],
    queryFn: () => getUserInfo(),
    enabled: fetchOnMount,
  })
}

export const useUpdateUserInfo = () => {
  return useMutation({
    mutationFn: (data: ModifyUserInfo) => updateUserInfo(data),
  })
}

export const useGetLikedPosts = (data: UserListRequestInfo) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS],
    queryFn: () => getLikedPosts(data),
    enabled: false,
  })
}

export const useGetCommentsByBoardId = (boardId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS],
    queryFn: () => getCommentByBoardId(boardId),
    enabled: false,
  })
}

export const useCerateComment = () => {
  return useMutation({
    mutationFn: (data: AddCommentRequestDto) => createComment(data),
  })
}

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: (data: EditCommentRequestDto) => updateComment(data),
  })
}

export const useDeleteCommentById = () => {
  return useMutation({
    mutationFn: (replyId: string) => deleteCommentById(replyId),
  })
}

export const useGetPostLikeStatus = (boardId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKE_STATUS, boardId],
    queryFn: () => getPostLikeStatus(boardId),
    enabled: false,
  })
}

export const useLikePostById = () => {
  return useMutation({
    mutationFn: ({
      boardId,
      signal,
    }: {
      boardId: string
      signal: AbortSignal
    }) => likePostById(boardId, signal),
  })
}

export const useUnlikePostById = () => {
  return useMutation({
    mutationFn: ({
      postLikeId,
      signal,
    }: {
      postLikeId: string
      signal: AbortSignal
    }) => unlikePostById(postLikeId, signal),
  })
}

export const useGetUsersFromAdmin = ({
  username,
  page,
}: {
  username?: string
  page?: string
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS_FROM_ADMIN],
    queryFn: () => getUsersInfoFromAdmin({ username, page }),
    enabled: false,
  })
}

export const useGetAdminDashboard = (data: UserListRequestInfo) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMIN_DASHBOARD],
    queryFn: () => getAdminDashboard(data),
  })
}

export const useDeletePostFromAdmin = () => {
  return useMutation({
    mutationFn: (boardId: string) => deletePostFromAdmin(boardId),
  })
}

export const useGetBlacklist = (data: BlacklistListRequestDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BLACKLIST],
    queryFn: () => getBlacklistPage(data),
    enabled: false,
  })
}

export const useRegisterBlacklist = () => {
  return useMutation({
    mutationFn: (data: BlacklistCreateRequestDto) => registerBlacklist(data),
  })
}

export const useUpdateBlacklist = () => {
  return useMutation({
    mutationFn: (data: BlacklistUpdateRequestDto) => updateBlacklist(data),
  })
}

export const useDeleteBlacklist = () => {
  return useMutation({
    mutationFn: (blacklistId: string) => deleteBlacklist(blacklistId),
  })
}

export const useMakeBlacklistPermanent = () => {
  return useMutation({
    mutationFn: (blacklistId: string) => makeBlacklistPermanent(blacklistId),
  })
}

export const useGetBlacklistHistory = (data: BlacklistHistoryListRequestDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BLACKLIST_HISTORY],
    queryFn: () => getBlacklistHistoryPage(data),
    enabled: false,
  })
}

export const useGetBlacklistHistoryByTarget = (
  data: BlacklistHistoryByTargetRequestDto,
  enabled: boolean
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BLACKLIST_HISTORY_BY_TARGET, data.blacklistId, data.page],
    queryFn: () => getBlacklistHistoryByTarget(data),
    enabled,
  })
}

export const useGetMyBlacklistHistory = (page: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MY_BLACKLIST_HISTORY, page],
    queryFn: () => getMyBlacklistHistory(page.toString()),
  })
}
