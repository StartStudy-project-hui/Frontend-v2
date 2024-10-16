export const CategoryList = [
  {
    id: 0,
    title: '전체',
    value: '전체',
  },
  {
    id: 1,
    title: '코테',
    value: '코테',
  },
  {
    id: 2,
    title: '프로젝트',
    value: '프로젝트',
  },
  {
    id: 3,
    title: 'CS',
    value: 'CS',
  },
  {
    id: 4,
    title: 'ETC',
    value: '기타',
  },
]

export const OrderList = [
  {
    id: 0,
    title: '최신순',
    value: '0',
  },
  {
    id: 1,
    title: '인기순',
    value: '1',
  },
]

export const ConnectionTypes = [
  {
    id: 0,
    title: '전체',
    value: '',
  },
  {
    id: 1,
    title: '온라인',
    value: 'ONLINE',
  },
  {
    id: 2,
    title: '오프라인',
    value: 'OFFLINE',
  },
]

export const MyPageList = [
  {
    id: 0,
    title: '프로필',
    value: 'profile',
  },
  {
    id: 1,
    title: '작성글',
    value: 'posts',
  },
  {
    id: 2,
    title: '관심목록',
    value: 'likes',
  },
]

export const AdminPageList = [
  {
    id: 0,
    title: '대시보드',
    value: 'dashboard',
  },
  {
    id: 1,
    title: '사용자 조회',
    value: 'manage',
  },
]

export const RecruitList = [
  {
    id: 0,
    title: '모집중',
    value: '모집중',
  },
  {
    id: 1,
    title: '모집완료',
    value: '모집완료',
  },
]

export const BOARDS = [
  {
    boardId: 0,
    nickname: '닉네임1',
    title: '제목입니다',
    content:
      '내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용 ',
    recurit: '모집중',
    type: 'CS',
    time: '00:00T',
    hitCnt: 32,
    replyCnt: 5,
  },
  {
    boardId: 1,
    nickname: '닉네임2',
    title: '제목입니다2',
    content: '내용 내용 내용내용 내용 내용내용 내용 내용 ',
    recurit: '모집완료',
    type: '코테',
    time: '00:00T',
    hitCnt: 32,
    replyCnt: 5,
  },
  {
    boardId: 2,
    nickname: '닉네임3',
    title: '제목입니다3',
    content: '내용 내용 내용내용 내용 내용내용 내용 내용 ',
    recurit: 'CS',
    type: 'CS',
    time: '00:00T',
    hitCnt: 32,
    replyCnt: 5,
  },
  {
    boardId: 3,
    nickname: '닉네임4',
    title: '제목입니다4',
    content: '내용 내용 내용내용 내용 내용내용 내용 내용 ',
    recurit: '기타',
    type: 'CS',
    time: '00:00T',
    hitCnt: 32,
    replyCnt: 5,
  },
]

export const POST_DETAIL = {
  postLike: '',
  postLikeId: 1,
  recruit: '모집중',
  title: '제목',
  userId: '닉네임',
  createTime: '00:00T',
  myBoard: true,
  content:
    '내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용내용 내용 내용',
  viewCnt: 22,
  category: '프로젝트',
  replyResponseDto: {},
}

export const REPLYS = [
  {
    replyId: 1,
    parentId: 2,
    memberRequestDto: { memberId: 3, nickname: '닉넴' },
    content: '댓글내용내용코멘트',
    createTime: '00:00T',
    children: [{}],
    myReply: true,
    updateTime: '00:01T',
  },
  {
    replyId: 1,
    parentId: 2,
    memberRequestDto: { memberId: 3, nickname: '닉넴' },
    content: '댓글내용내용코멘트',
    createTime: '00:00T',
    children: [{}],
    myReply: true,
    updateTime: '00:01T',
  },
  {
    replyId: 1,
    parentId: 2,
    memberRequestDto: { memberId: 3, nickname: '닉넴' },
    content: '댓글내용내용코멘트',
    createTime: '00:00T',
    children: [{}],
    myReply: true,
    updateTime: '00:01T',
  },
]

export const USER = {
  username: '김김김',
  nickname: 'Happyu',
  email: 'abc@abc.com',
  role: 'user',
}
