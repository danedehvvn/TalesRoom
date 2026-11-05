const themeRepository = require('../repositories/themeRepository');

//1. 테마 목록 조회
const getThemes=async(page)=>{
  const limit= 10; //10개 페이징
  const offset = (page-1)*limit;

  const result = await themeRepository.findAllThemes(limit, offset); //{count, rows} 반환

  // Sequelize 모델 결과(result) → API 응답 객체로 변환
  const items = result.rows.map((theme) => {
    const t = theme.get({ plain: true });

    //JSON 응답 형식 맞춰서
    return {
      id: t.id,
      title: t.title,
      storeName: t.storeName,
      genre: t.genre,
      minPeople: t.minPeople,
      maxPeople: t.maxPeople,
      playTime: t.playTime,
      difficulty: t.difficulty,
      createdAt: t.createdAt,
    };
  });

  return{
    items, //변환된 배열
    pagination:{
      page,
      limit,
      totalCount: result.count, // 테마 총 개수
      totalPage: Math.ceil(result.count / limit) //페이지네이션 적용시 총 페이지
    }
  }
}

//2. 테마 상세 정보 조회
const getThemeById= async (id)=>{
  const theme= await themeRepository.findThemeById(id);

  if(!theme){ // 해당 아이디가 없으면
    const error = new Error('존재하지 않는 아이디의 테마입니다.');
    error.status=404;
    throw error;
  }

  return theme;
}


module.exports = { getThemes, getThemeById };