const themeReviewService = require('../services/themeReviewService');

//1. 테마별 후기 목록 조회
const getThemeReviews= async (req,res,next)=>{
  try{
    const id=Number(req.params.id);

    if(!Number.isSafeInteger(id) || id <1){
      return res.status(400).json({
        error: "올바른 테마 ID를 입력해 주세요."
      });
    }

    //쿼리스트링에서 받아옴
    let page=Number(req.query.page ) || 1;
    let size=Number(req.query.size ) || 1;

    if(!Number.isSafeInteger(page) || page <1){
      page=1;
    }

    if(!Number.isSafeInteger(size) || size <1){
      size=1;
    }

    const result =await themeReviewService.getThemeReviews(id, page, size);

    res.status(200).json(result);

  }catch(err){

    // next(error); //공통 에러 미들웨어로 넘김(아직 없음)
    console.error(err)

    const status =err.status||500
    res.status(status).json({error: err.message || "서버 오류가 발생했습니다."})

  }
}

// //2. 테마 상세 정보 조회
// const getThemeById = async(req,res,next)=>{
//   try{
//     //params에서 id 추출
//     const id=Number(req.params.id);

//     if(!Number.isSafeInteger(id) || id <1){
//       return res.status(400).json({
//         error: "올바른 테마 ID를 입력해 주세요."
//       });
//     }

//     const theme=await themeService.getThemeById(id);
    
//     res.status(200).json(theme);

//   }catch(err){
//     // next(error); //공통 에러 미들웨어로 넘김(아직 없음)
//     console.error(err)

//     const status =err.status||500
//     res.status(status).json({error: err.message || "서버 오류가 발생했습니다."})
//   }
// }

module.exports = { getThemeReviews};