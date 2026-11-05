const themeService = require('../services/themeService');

//1. 테마 목록 조회
const getThemes= async (req,res,next)=>{
  try{
    //쿼리스트링에서 받아옴
    let page=Number(req.query.page ) || 1;

    if(!Number.isSafeInteger(page) || page <1){
      page=1;
    }

    const result =await themeService.getThemes(page)

    res.status(200).json(result)

  }catch(err){

    // next(error); //공통 에러 미들웨어로 넘김(아직 없음)
    console.error(err)

    const status =err.status||500
    res.status(status).json({error: err.message || "서버 오류가 발생했습니다."})

  }
}

//2. 테마 상세 정보 조회
const getThemeById = async(req,res,next)=>{
  try{
    //params에서 id 추출
    const id=Number(req.params.id);

    if(!Number.isSafeInteger(id) || id <1){
      return res.status(400).json({
        error: "올바른 테마 ID를 입력해 주세요."
      });
    }

    const theme=await themeService.getThemeById(id);
    
    res.status(200).json(theme);

  }catch(err){
    // next(error); //공통 에러 미들웨어로 넘김(아직 없음)
    console.error(err)

    const status =err.status||500
    res.status(status).json({error: err.message || "서버 오류가 발생했습니다."})
  }
}

function sendErrorResponse(res, error) {
    const statusCode =
        error.statusCode ||
        error.status ||
        500;

    console.error(error);

    return res.status(statusCode).json({
        success: false,
        data: null,
        message:
            statusCode === 500
                ? '서버 내부 오류가 발생했습니다.'
                : error.message
    });
}

// T-01 테마 목록·복합 필터
async function getList(req, res) {
    try {
        const data =
            await themeService.getFilteredThemes(
                req.query
            );

        return res.status(200).json({
            success: true,
            data,
            message: 'OK'
        });
    } catch (error) {
        return sendErrorResponse(
            res,
            error
        );
    }
}

// M-01 관리자 테마 등록
async function create(req, res) {
    try {
        const data =
            await themeService.createTheme(
                req.user,
                req.body
            );

        return res.status(201).json({
            success: true,
            data,
            message:
                '테마가 등록되었습니다.'
        });
    } catch (error) {
        return sendErrorResponse(
            res,
            error
        );
    }
}

// M-02 관리자 테마 수정
async function update(req, res) {
    try {
        const data =
            await themeService.updateTheme(
                req.user,
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            data,
            message: '수정되었습니다.'
        });
    } catch (error) {
        return sendErrorResponse(
            res,
            error
        );
    }
}

// M-03 관리자 테마 삭제
async function remove(req, res) {
    try {
        await themeService.deleteTheme(
            req.user,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: null,
            message: '삭제되었습니다.'
        });
    } catch (error) {
        return sendErrorResponse(
            res,
            error
        );
    }
}

module.exports = { getThemes, getThemeById, getList, create, update, remove};