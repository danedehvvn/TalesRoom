import API from './client';
import { responseData } from './themeApi';

export async function setThemeBookmark(themeId, bookmarked) {
  const response = bookmarked
    ? await API.post(`/api/bookmarks/${themeId}`)
    : await API.delete(`/api/bookmarks/${themeId}`);
  const data = responseData(response);
  if (typeof data.isBookmarked !== 'boolean') {
    throw new Error('북마크 처리 결과를 확인하지 못했습니다. 새로고침 후 확인해 주세요.');
  }
  return data.isBookmarked;
}
