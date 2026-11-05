const { ThemeReview, User} = require('../models');       


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

// 2. 후기평점 등록
// const createThemeReview= async(content)=>{
//   return await Theme.findByPk(id);
// }

// const createBoard=async(title, content, user_id)=>{
//   const board =await Board.create({title, content, user_id})
//   return board;
// }

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


module.exports = { findThemeReviews };