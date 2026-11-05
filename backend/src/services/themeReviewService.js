const themeReviewRepository = require('../repositories/themeReviewRepository');
const themeRepository = require('../repositories/themeRepository');

//1. 테마별 후기 목록 조회
const getThemeReviews= async (id, page, size)=>{
  const limit= size;
  const offset = (page-1)*limit;

  // 테마 존재하는지 확인
  const theme = await themeRepository.findThemeById(id);

  if (!theme) {
    const error = new Error('테마를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  const result = await themeReviewRepository.findThemeReviews(id, limit, offset); //{count, rows} 반환

  // Sequelize 모델 결과(result) → API 응답 객체로 변환
  const items = result.rows.map((themeReview) => {
    const tr = themeReview.get({ plain: true });

    //JSON 응답 형식 맞춰서
    return {
      id: tr.id,
      rating: tr.rating,
      content: tr.content,
      author: {
        userId: tr.userId,
        nickname: tr.author.nickname
      },
      createdAt: tr.createdAt,
    };
  });

  return{
    items, //변환된 배열
    pagination:{
      page,
      size,
      totalCount: result.count, // 후기 총 개수
      totalPage: Math.ceil(result.count / size) //페이지네이션 적용시 총 페이지
    }
  }
}

//2. 후기 등록
const createThemeReview = async (rating,content,userId,themeId)=>{

  // 로그인 여부 확인
  // JWT 미들웨어 완성 후에는 라우터에서 인증 처리
  if (!userId) {
    const error = new Error('로그인이 필요합니다.');
    error.status = 401;
    throw error;
  }

  // 입력값 검증
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error('평점은 1~5 사이여야 합니다.');
    error.status = 400;
    throw error;
  }

  //이 유저가 이미 후기를 작성했는지 조회
  const existingReview = await themeReviewRepository.findByThemeAndUser(themeId, userId);

  if (existingReview) {
    const error = new Error('이미 후기를 작성한 테마입니다.');
    error.status = 400;
    throw error;
  }

  // 테마 존재하는지 확인
  const theme = await themeRepository.findThemeById(themeId);

  if (!theme) {
    const error = new Error('테마를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  const review= await themeReviewRepository.createThemeReview(rating,content,userId,themeId);

  // 등록 후 평균 평점과 후기 개수 조회
  const summary = await themeReviewRepository.getRatingSummary(themeId);

  return {
    id: review.id, //새로 등록된 후기의 id 반환
    avgRating: summary.avgRating,
    reviewCount: summary.reviewCount
  };

}



// //2. 테마 상세 정보 조회
// const getThemeById= async (id)=>{
//   const theme= await themeRepository.findThemeById(id);

//   if(!theme){ // 해당 아이디가 없으면
//     const error = new Error('존재하지 않는 아이디의 테마입니다.');
//     error.status=404;
//     throw error;
//   }

//   return theme;
// }


module.exports = { getThemeReviews,createThemeReview };