const { ThemeReview, User, Theme} = require('../models');       
const { fn, col } = require('sequelize');

// 1. 후기평점 조회
const findThemeReviews= async (themeId, limit, offset)=>{
  return await ThemeReview.findAndCountAll({
    where:{themeId}, //특정 테마 아이디의 후기평점 목록 조회
    limit,
    offset,
    //users와 JOIN
    include: [{
            model: User,
            as: 'author',   
            attributes: [['id', 'userId'], 'nickname'],
        }],

    order:[['createdAt','DESC']]
  });
}

//2. 후기평점 등록
const createThemeReview= async (rating, content, userId, themeId)=>{
  const themeReveiw =await ThemeReview.create({rating, content, userId, themeId})
  return themeReveiw;
}

// 2-1. 특정 회원이 해당 테마에 이미 후기를 작성했는지 확인
const findByThemeAndUser = async (themeId, userId) =>{
  return await ThemeReview.findOne({
    where: {
      themeId,
      userId
    }
  });
};

// 2-2. 평균 평점과 후기 개수
const getRatingSummary = async (themeId) => {
  const result = await ThemeReview.findOne({
    attributes: [
      [fn('AVG', col('rating')), 'avgRating'],
      [fn('COUNT', col('id')), 'reviewCount']
    ],
    where: { themeId },
    raw: true
  });

  return {
    avgRating: Number(result?.avgRating ?? 0), //? - 옵셔널 체이닝 적용
    reviewCount: Number(result?.reviewCount ?? 0)
  };
};


// //3. 후기 평점 삭제
// const deleteThemeReview=async(id)=>{

// }
// const deleteBoard =async (id)=>{
//   const board=await Board.findByPk(id)

//   if(!board){
//     const error=new Error("게시글 못찾음")
//     error.status=404
//     throw error
//   }

//   await board.destroy();

//   return board;
// }


module.exports = { findThemeReviews, createThemeReview, findByThemeAndUser, getRatingSummary };

