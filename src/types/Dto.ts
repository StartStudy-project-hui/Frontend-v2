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
  userId: string
  viewCnt: number
  category: string
  replyResponseDto: ReplyResponseDto
}

//-------------------------------상세게시글

export interface MemberRequestDto {
  memberId: number
  nickname: string
}

export interface ReplyResponseDto {
  getTotal: number
  replies: ReplyDto[]
}

export interface ReplyDto {
  replyId: number | undefined
  parentId: number | undefined
  memberRequestDto: MemberRequestDto
  content: string
  createTime: string
  children: ReplyDto[]
  myReply: boolean
  updateTime: string
}

//사용자 게시글----------------------------
export interface UserListRequestInfo {
  recruit: string | null
  category: string | null
  order: number | null
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

//게시글삭제
export interface DeletePostInfo {
  boardId: string
}
//사용자정보
export interface UserInfoDto {
  username: string
  nickname: string
  email: string
  role: string
}

//사용자정보수정
export interface ModifyUserInfo {
  username: string | undefined
  nickname: string | undefined
}
//댓글
export interface AddParentCommentInfo {
  boardId: number | undefined
  content: string | undefined
}
export interface AddChildCommentInfo {
  boardId: number | undefined
  parentId: number | undefined
  content: string | undefined
}
export interface ModifyCommentInfo {
  replyId: number | undefined
  content: string | undefined
}
//유저정보조회
export interface UserDto {
  seq: number
  username: string
  nickname: string
  email: string
  role: string
}

export interface SortDto {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface UserResponseDto {
  totalElements: number
  totalPages: number
  size: number
  content: UserDto[]
  number: number
  sort: SortDto
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: PageableDto
  empty: boolean
}
