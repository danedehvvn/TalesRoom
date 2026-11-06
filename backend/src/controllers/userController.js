const userService = require(
  "../services/userService"
);

// User Controller에서 사용할 에러 응답 함수
const sendErrorResponse = (
  res,
  error
) => {
  const statusCode =
    error.statusCode || 500;

  // 실제 오류는 서버 터미널에서 확인
  console.error(error);

  // 예상하지 못한 서버 오류는
  // 상세 내용을 외부에 노출하지 않는다.
  const message =
    statusCode === 500
      ? "서버 내부 오류가 발생했습니다."
      : error.message;

  return res
    .status(statusCode)
    .json({
      success: false,
      data: null,
      message
    });
};

//내 정보 조회
const getMyInfo = async (req, res) => {
  try {
    // 미들웨어에서 저장한 id
    const userId = req.user.id;

    // service에 사용자 정보 조회 요청
    const data =
      await userService.getUserById(userId);
 
    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
  
    return sendErrorResponse(res, error);
  }
};

const updateMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const data =
      await userService.updateProfile(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      data,
      message: "수정되었습니다."
    });
  } catch (error) {
  
    return sendErrorResponse(res, error);
  }
};

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const data =
      await userService.getMyPosts(
        userId,
        req.query
      );

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
   
    return sendErrorResponse(res, error);
  }
};

const getMyComments = async (req, res) => {
  try {
    const userId = req.user.id;

    const data =
      await userService.getMyComments(
        userId,
        req.query
      );

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
  
    return sendErrorResponse(res, error);
  }
};

module.exports = {
  getMyInfo,
  updateMyInfo,
  getMyPosts,
  getMyComments
};
