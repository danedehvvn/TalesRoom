const { Bookmark } = require('../models');

// 1. 북마크 등록
const createBookmark = async (userId, themeId) => {
  const bookmark = await Bookmark.create({ userId, themeId })
  return bookmark;
}

// 2. 특정 회원이 해당 테마를 북마크했는지 확인
const isBookmarked = async (userId, themeId) => {
  const bookmark = await Bookmark.findOne({
    where: {
      themeId,
      userId
    }
  });

  return !!bookmark;
};


//3. 북마크 삭제
const deleteBookmark = async (userId, themeId) => {
  return await Bookmark.destroy(
    {
      where: {
        userId,
        themeId
      }
    }
  )
}

module.exports = { createBookmark, isBookmarked, deleteBookmark };