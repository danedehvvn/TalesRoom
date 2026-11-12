const userService = require("../services/userService");

// User Controller에서 사용할 에러 응답 함수

// 내 정보 조회
const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.getUserById(userId);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
      return next(error);
  }
};

const updateMyInfo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      data,
      message: "수정되었습니다."
    });
  } catch (error) {
      return next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.getMyPosts(userId, req.query);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
      return next(error);
  }
};

const getMyComments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.getMyComments(userId, req.query);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
      return next(error);
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await userService.getMyBookmarks(userId, req.query);

    return res.status(200).json({
      success: true,
      data,
      message: "OK"
    });
  } catch (error) {
      return next(error);
  }
};

// 명예의 전당 조회 컨트롤러 함수
const getHallOfFame = async (req, res, next) => {
  try {
    const data = await userService.getHallOfFame();

    return res.status(200).json({
      success: true,
      data,
      message: "명예의 전당 조회 성공"
    });
  } catch (error) {
      return next(error);
  }
};

module.exports = { getMyInfo, updateMyInfo, getMyPosts, getMyComments, getMyBookmarks, getHallOfFame };