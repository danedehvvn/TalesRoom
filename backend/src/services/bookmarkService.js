const bookmarkRepository = require('../repositories/bookmarkRepository');
const themeRepository = require('../repositories/themeRepository');
const { Bookmark } = require('../models');

//1. 북마크 추가
const createBookmark = async (userId, themeId) => {
  //실존하는 테마인지 조회
  const theme = await themeRepository.findThemeById(themeId);

  if (!theme) {
    const error = new Error('테마를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  //이미 북마크에 추가했었는지 조회
  const existingBookmark = await bookmarkRepository.isBookmarked(userId, themeId);

  if (existingBookmark) {
    const error = new Error('이미 북마크한 테마입니다.');
    error.status = 400;
    throw error;
  }

  //추가
  await bookmarkRepository.createBookmark(userId, themeId);

  return {
    themeId,
    isBookmarked: true
  };
}


//2. 북마크 삭제
const deleteBookmark = async (userId, themeId) => {
  //실존하는 테마인지 조회
  const theme = await themeRepository.findThemeById(themeId);

  if (!theme) {
    const error = new Error('테마를 찾을 수 없습니다.');
    error.status = 404;
    throw error;
  }

  //북마크에 추가했었는지 조회
  const existingBookmark = await bookmarkRepository.isBookmarked(userId, themeId);

  //없었으면 오류
  if (!existingBookmark) {
    const error = new Error('이미 북마크에서 제거한 테마입니다.');
    error.status = 400;
    throw error;
  }

  //삭제
  await bookmarkRepository.deleteBookmark(userId, themeId);

  return {
    themeId,
    isBookmarked: false
  };
}



module.exports = { createBookmark, deleteBookmark };
