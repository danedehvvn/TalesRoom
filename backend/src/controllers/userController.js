const userService = require("../services/userService");

// User Controller에서 사용할 에러 응답 함수
const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;

  console.error(error);
  const message = statusCode === 500 ? "서버 내부 오류가 발생했습니다." : error.message;

  return res.status(statusCode).json({ success: false, data: null, message });
};

// 내 정보 조회
const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await userService.getUserById(userId);

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
    const data = await userService.updateProfile(userId, req.body);

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
    const data = await userService.getMyPosts(userId, req.query);

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
    const data = await userService.getMyComments(userId, req.query);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await userService.getMyBookmarks(userId, req.query);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

// 명예의 전당 조회 컨트롤러 함수
const getHallOfFame = async (req, res) => {
  try {
    const data = await userService.getHallOfFame();

    return res.status(200).json({
      success: true,
      data,
      message: "명예의 전당 조회 성공"
    });
  } catch (error) {
    return sendErrorResponse(res, error);
  }
};

module.exports = { getMyInfo, updateMyInfo, getMyPosts, getMyComments, getMyBookmarks, getHallOfFame };