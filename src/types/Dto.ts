export interface SigninInfo {
  email: string
  pwd: string
}

export interface SignupInfo {
  name: string
  pwd: string
  email: string
  checkPwd: string
}

export interface WritePostRequestDto {
  content: string
  category: string
  title: string
  nickname: string | null
}

export interface ModifyPostInfo {
  boardId: string
  content: string
  category: string
  title: string
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
  page?: string
  category: string
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
  replyResponseDto: ReplyResponseDto
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
  replyId: number | undefined
  parentId: number | undefined
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
