const themeReviewService = require('../services/themeReviewService');
const authMiddleware=require('../middlewares/authMiddleware');

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
    let size=Number(req.query.size ) || 10;

    if(!Number.isSafeInteger(page) || page <1){
      page=1;
    }

    if(!Number.isSafeInteger(size) || size <1){
      size=1;
    }

    const result =await themeReviewService.getThemeReviews(id, page, size);

    res.status(200).json(result);

  } catch (err) {
      return next(err);
  }
}

//2. 평점 후기 등록 
const createThemeReview=async(req,res,next)=>{
  try{
    const themeId=Number(req.params.id);

    if(!Number.isSafeInteger(themeId) || themeId <1){
      return res.status(400).json({
        error: "올바른 테마 ID를 입력해 주세요."
      });
    }

    const {rating, content}=req.body;

    // 인증
    const userId = req.user.id;

    const result=await themeReviewService.createThemeReview(rating, content, userId,themeId);

    res.status(201).json({success: true, data: result, message:"후기가 등록되었습니다."})


  } catch (err) {
      return next(err);
  }
}

//3. 평점 후기 삭제
const deleteThemeReview=async (req,res,next)=>{
  try{

    const themeId= Number(req.params.id);
    const targetUserId = req.query.userId;

    //로그인 유저 정보 가져오기 
    const loginUserId = req.user.id;
    const role = req.user.role;

    const result= await themeReviewService.deleteThemeReview(themeId, loginUserId, role, targetUserId)

    res.status(200).json({success: true, data: result, message:"후기가 삭제되었습니다."})

  } catch (err) {
      return next(err);
  }
}


module.exports = { getThemeReviews, createThemeReview, deleteThemeReview};