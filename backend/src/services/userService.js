const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository",);
const { duplicateNickname } = require("./authService",);
const User = require("../models/User"); // 명예의 전당 조회 위한 User 모델 추가 
const Theme = require("../models/Theme"); //북마크 목록 조회 위한 Theme 모델 추가

const createHttpError = (statusCode, message,) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

// 방탈출 감성 등급 계산 공통 헬퍼 함수
const calculateGrade = (score) => {
  if (score >= 1000) return '방탈출 장인';
  if (score >= 500) return '방탈출 고인물';
  if (score >= 200) return '베테랑 이스케이퍼';
  if (score >= 100) return '코드 브레이커';
  if (score >= 50) return '일반 방탈출러';
  return '방린이';
};

// page size
const parsePositiveInteger = (value, defaultValue, fieldName,) => {
  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue = Number(value); // req query 숫자로 변환
  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw createHttpError(400, `${fieldName}는 1 이상의 정수여야 합니다.`,);
  }

  return parsedValue;
};

//page, size를 db조회에쓸 값으로 바꾸기
const parsePagination = (query = {}) => {
  const page = parsePositiveInteger(query.page, 1, "page",);
  const size = parsePositiveInteger(query.size, 10, "size",);

  return { page, size, offset: (page - 1) * size, };
};

// U-01 내 정보 조회
const getUserById = async (userId) => { // 로그인한 사람 정보를 db에서 조회합니다
  const user = await userRepository.findById(userId);
  if (!user) { //!user면 404
    throw createHttpError(404, "사용자를 찾을 수 없습니다.",);
  }

  // 비밀번호 제외한 정보를 controller에 줍니다
  return user;
};

// U-02 닉네임·비밀번호 변경
const updateProfile = async (userId, requestBody = {},) => {
  const body = requestBody && typeof requestBody === "object" ? requestBody : {};
  const { nickname, currentPassword, newPassword, } = body;
  const user = await userRepository.findPasswordById(userId,); // 비밀번호 검증을 위해 암호화된 비밀번호 조회
  if (!user) {
    throw createHttpError(404, "사용자를 찾을 수 없습니다.",);
  }

  const updateData = {};

  // 닉네임 변경
  if (nickname !== undefined) {
    if (typeof nickname !== "string") {
      throw createHttpError(400, "닉네임 형식이 올바르지 않습니다.",);
    }

    const normalizedNickname = nickname.trim();
    if (normalizedNickname.length < 2 || normalizedNickname.length > 10) {
      throw createHttpError(400, "닉네임은 2자 이상 10자 이하로 입력해야 합니다.",);
    }

    //같은 닉네임 쓰는지 확인 (authService 공용 함수 사용)
    //두 번째 값으로 내 아이디(userId)를 넘겨서 본인은 검사 제외
    const duplicateError = await duplicateNickname(normalizedNickname, userId,);
    if (duplicateError) { //중복닉네임 에러
      throw createHttpError(duplicateError.status, duplicateError.message,);
    }

    //검증 끝난 닉네임만 수정 대상
    updateData.nickname = normalizedNickname;
  }

  // 둘중하나라도 되면 비밀번호 변경 요청으로 갑니다
  const passwordChangeRequested = currentPassword !== undefined || newPassword !== undefined;

  // 비밀번호 변경
  if (passwordChangeRequested) {
    if (typeof currentPassword !== "string" || currentPassword.length === 0 ||
      typeof newPassword !== "string" || newPassword.length === 0) {
      throw createHttpError(400, "비밀번호 변경 시 현재 비밀번호와 새 비밀번호가 필요합니다.",);
    }

    // 새 비밀번호에 영어, 숫자 있는지 확인
    const hasLetter = /[A-Za-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (newPassword.length < 8 || newPassword.length > 20 || !hasLetter || !hasNumber) {
      throw createHttpError(400, "새 비밀번호는 8~20자이며 영문과 숫자를 포함해야 합니다.",);
    }

    // 입력한 지금 비밀번호와 db bcrypt 해시랑 비교합니다
    const passwordMatched = await bcrypt.compare(currentPassword, user.password,);

    if (!passwordMatched) {
      throw createHttpError(400, "현재 비밀번호가 올바르지 않습니다.",);
    }

    // 가입때 쓴 bcrypt rounds를 읽습니다
    const saltRounds = bcrypt.getRounds(user.password,);

    // 새 비밀번호를 암호화
    updateData.password = await bcrypt.hash(newPassword, saltRounds,);
  }

  // 닉네임과 비밀번호 모두 전달안되면 수정 안됩니다
  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, "변경할 정보가 없습니다.",);
  }

  // 검증 끝난 필드만 db에 반영합니다
  try {
    await userRepository.update(userId, updateData,);
  } catch (error) {
    // 같은 닉네임으로 변경할때, db unique 로 중복 오류 발생가능합니다
    if (error.name === "SequelizeUniqueConstraintError") {
      throw createHttpError(400, "이미 사용 중인 닉네임입니다.",);
    }
    throw error;
  }

  // 수정된 정보 다시 조회
  const updatedUser = await userRepository.findById(userId);
  if (!updatedUser) {
    throw createHttpError(404, "사용자를 찾을 수 없습니다.",);
  }

  // 필요한 값만 주기
  return { userId: updatedUser.userId, nickname: updatedUser.nickname, };
};

// U-03 내가 쓴 글
const getMyPosts = async (userId, query = {},) => {
  const { page, size, offset, } = parsePagination(query);
  const [rows, totalCount] = await Promise.all([
    userRepository.findMyPosts(userId, size, offset,),
    userRepository.countMyPosts(userId,),
  ]);

  // reposiotry 조회결과를 api 명세 items 형식으로 바꿈
  const items = rows.map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,

    author: { userId: row.author.userId, nickname: row.author.nickname, },

    viewCount: Number(row.viewCount),
    likeCount: Number(row.likeCount),
    commentCount: Number(row.commentCount),
    isSolved: Boolean(row.isSolved),
    isSpoiler: Boolean(row.isSpoiler),
    createdAt: row.createdAt,
  }));

  // 목록 페이징 정보를 Controller에 주기
  return { items, page, size, totalCount, totalPages: Math.ceil(totalCount / size,), };
};

// U-04 내가 쓴 댓글
const getMyComments = async (userId, query = {}) => {
  const { page, size, offset } = parsePagination(query); // page, size를 실제 페이징 값으로 바꿈

  // 댓글 목록, 전체 댓글 수 동시에 조회
  const [rows, totalCount] =
    await Promise.all([
      userRepository.findMyComments(userId, size, offset),
      userRepository.countMyComments(userId)
    ]);

  // Repository 조회 결과를 API 명세 형식으로 바꿈
  const items = rows.map((row) => ({
    id: row.id,
    postId: row.postId,
    postTitle: row.postTitle,
    content: row.content,
    isAccepted: Boolean(row.isAccepted),
    createdAt: row.createdAt,
  }));

  // 목록 페이징 정보 controller에 주기
  return { items, page, size, totalCount, totalPages: Math.ceil(totalCount / size), };
};

// U-05 내 북마크 목록
const getMyBookmarks = async (userId, query = {}) => {
  const { page, size, offset } = parsePagination(query); // page, size를 실제 페이징 값으로 바꿈

  // 북마크 목록, 북마크 댓글 수 동시에 조회
  const [rows, totalCount] =
    await Promise.all([
      userRepository.findMyBookmarks(userId, size, offset),
      userRepository.countMyBookmarks(userId),
    ]);

  // Repository 조회 결과를 API 명세 형식으로 바꿈
  const items = rows.map((row) => ({
    id: row.theme.id,
    title: row.theme.title,
    storeName: row.theme.storeName,
    thumbnailUrl: row.theme.thumbnailUrl,
    genre: row.theme.genre,
    isBookmarked: true, //무조건 true로 반환
  }));

  // 목록 페이징 정보 controller에 주기
  return { items, page, size, totalCount, totalPages: Math.ceil(totalCount / size), };
};

// 명예의 전당 상위 5명 회원 조회 비즈니스 로직 (동점자 정렬 기준 추가)
const getHallOfFame = async () => {
  const topUsers = await User.findAll({
    attributes: ['id', 'nickname', 'score', 'grade'],
    order: [
      ['score', 'DESC'],       // 1순위: 점수가 높은 순
      ['createdAt', 'ASC']     // 2순위: 먼저 가입한 회원 우선 (또는 'DESC'로 최근 가입 순)
    ],
    limit: 5 // 상위 5명
  });

  return topUsers;
};

module.exports = { getUserById, updateProfile, getMyPosts, getMyComments, getMyBookmarks, getHallOfFame, calculateGrade };
