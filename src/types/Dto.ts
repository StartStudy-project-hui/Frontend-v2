export interface SigninInfo {
  email: string
  pwd: string
}

export interface SignupRequestDto {
  name: string
  email: string
  nickname: string
  pwd: string
  checkPwd: string
}

export interface EmailSendCodeRequestDto {
  email: string
}

export interface EmailVerifyCodeRequestDto {
  email: string
  code: string
}

export interface WritePostRequestDto {
  content: string
  category: string
  title: string
  nickname: string | null
  connectionType: string
  offlineLocation: {
    x: number
    y: number
  } | null
}

export interface ModifyPostInfo {
  boardId: string
  content: string
  category: string
  title: string
  connectionType: string
  offlineLocation: {
    x: number
    y: number
  } | null
}

export interface ModifyRecruitInfo {
  boardId: string
  recruit: string
}

// =======================
// BOARD
// =======================
export interface BoardRequestDto {
  order: string
  category: string
  connectionType?: string
  page?: string
  title?: string
}

export interface BoardResponseDto {
  content: BoardItemDto[]
  pageable: PageableDto
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface BoardItemDto {
  nickname: string
  boardId: number
  recurit: string
  type: string
  connectionType: string
  content: string
  title: string
  time: string
  hitCnt: number
  replyCnt: number
}

export interface PageableDto {
  pageNumber: number
  pageSize: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface BoardDetailDto {
  recruit: string
  currentNickname: string
  title: string
  boardWriteNickname: string
  updateTime: string
  createTime: string
  content: string
  category: string
  viewCnt: number
  postLike: string
  postLikeId: string
  replyResponseDto: ReplyResponseDto
  connectionType: string
  offlineLocation: {
    x: number
    y: number
  } | null
}

export interface DeletePostInfo {
  boardId: string
}

// =======================
// COMMENT
// =======================
export interface AddCommentRequestDto {
  boardId: string
  content: string
  parentId?: string
  replyParent?: boolean
}

export interface EditCommentRequestDto {
  replyId: string
  content: string
}

export interface ReplyResponseDto {
  getTotal: number
  replies: ReplyDto[]
}

export interface ReplyDto {
  replyId: string | undefined
  parentId: string | undefined
  nickname: string
  content: string
  updateTime: string
  children: ReplyDto[]
}

export interface PureReplyDto {
  replyId: string | undefined
  parentId: string | undefined
  nickname: string
  content: string
  updateTime: string
}

// =======================
// USER
// =======================
export interface UserListRequestInfo {
  recruit: string | null
  category: string | null
  order: string | null
  connectionType?: string
  page?: string
}

export interface UserPostDto {
  totalPages: number
  totalElements: number
  size: number
  content: BoardItemDto[]
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: {
    offset: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    pageNumber: number
    pageSize: number
    unpaged: boolean
    paged: boolean
  }
  empty: boolean
}

export interface UserInfoDto {
  username: string
  nickname: string
  email: string
  role: string
  socialType: 'KAKAO' | 'NAVER' | ''
}

export interface ModifyUserInfo {
  username: string | undefined
  nickname: string | undefined
}

// =======================
// Admin
// =======================
export interface RetrievedUserInfo {
  seq: number
  username: string
  nickname: string
  email: string
  role: string
  socialType: 'KAKAO' | 'NAVER'
}

export interface UserResponseDto {
  totalElements: number
  totalPages: number
  size: number
  content: RetrievedUserInfo[]
  number: number
  sort: SortDto
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: PageableDto
  empty: boolean
}

export interface SortDto {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

// =======================
// BLACKLIST
// =======================
export type BlackType = 'EMAIL'
export type BlacklistStatus = 'PERMANENT' | 'ACTIVE' | 'EXPIRED'
export type BlacklistAction = 'REGISTER' | 'UPDATE' | 'DELETE' | 'EXTEND'

export interface BlacklistCreateRequestDto {
  rawValue: string
  reason: string
  durationMonths: number
}

export interface BlacklistUpdateRequestDto {
  blacklistId: string
  reason: string
}

export interface BlacklistListRequestDto {
  id?: string
  type?: BlackType
  status?: string
  email?: string
  page?: string
}

export interface BlacklistHistoryListRequestDto extends BlacklistListRequestDto {
  action?: string
}

export interface BlacklistHistoryByTargetRequestDto {
  blacklistId: string
  page?: string
}

export interface BlacklistItemDto {
  id: number
  type: BlackType
  reason: string
  createdAt: string
  status: BlacklistStatus
}

export interface BlacklistResponseDto {
  totalElements: number
  totalPages: number
  size: number
  content: BlacklistItemDto[]
  number: number
  sort: SortDto
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: PageableDto
  empty: boolean
}

export interface BlacklistHistoryItemDto {
  id: number
  reason: string
  createdAt: string
  type: BlackType
  createBy: string
  status: BlacklistStatus
  action: BlacklistAction
  hashValue: string
}

export interface BlacklistHistoryResponseDto {
  totalElements: number
  totalPages: number
  size: number
  content: BlacklistHistoryItemDto[]
  number: number
  sort: SortDto
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: PageableDto
  empty: boolean
}

export interface MyBlacklistHistoryItemDto {
  id: number
  reason: string
  createdAt: string
  type: BlackType
  status: BlacklistStatus
  action: BlacklistAction
}

export interface MyBlacklistHistoryResponseDto {
  content: MyBlacklistHistoryItemDto[]
  number: number
  size: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}
