const bookmarkService = require('../services/bookmarkService');

//1. 북마크 추가
const createBookmark = async (req, res, next) => {
  try {
    const themeId = Number(req.params.id);
    const userId = req.user.id;

    const result = await bookmarkService.createBookmark(userId, themeId);

    res.status(201).json({ success: true, data: result, message: "북마크가 추가되었습니다." })

  } catch (error) {
    console.error(error)

    const status = error.status || 500
    res.status(status).json({ error: error.message || "서버 오류가 발생했습니다." })
  }
}

//2. 북마크 삭제
const deleteBookmark = async (req, res, next) => {
  try {
    const themeId = Number(req.params.id);
    const userId = req.user.id;

    const result = await bookmarkService.deleteBookmark(userId, themeId);

    res.status(200).json({ success: true, data: result, message: "북마크가 삭제되었습니다." })

  } catch (error) {
    console.error(error)

    const status = error.status || 500
    res.status(status).json({ error: error.message || "서버 오류가 발생했습니다." })
  }
}

module.exports = { createBookmark, deleteBookmark };