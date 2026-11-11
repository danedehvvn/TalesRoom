import api from "./axiosInstance";

export async function fetchMyInfo() {
  const response = await api.get("/users/me");
  return response.data.data;
}

export async function updateMyInfo(body) {
  const response = await api.patch("/users/me", body);
  return response.data.data;
}

export async function fetchMyPosts(params) {
  const response = await api.get("/users/me/posts", { params });
  return response.data.data;
}

export async function fetchMyComments(params) {
  const response = await api.get("/users/me/comments", { params });
  return response.data.data;
}

export async function fetchHallOfFame() {
  const res = await api.get("/users/hall-of-fame");
  return res.data.data;
}

export async function fetchMyBookmarks(params, signal) {
  const response = await api.get('/users/me/bookmarks', { params, signal });
  const data = response.data?.data;
  if (response.data?.success === false) throw new Error(response.data.message || '북마크 목록을 불러오지 못했습니다.');
  if (!Array.isArray(data?.items) || data.totalCount == null || data.totalPages == null ||
    !Number.isSafeInteger(Number(data.totalCount)) || Number(data.totalCount) < 0 ||
    !Number.isSafeInteger(Number(data.totalPages)) || Number(data.totalPages) < 0) {
    throw new Error('북마크 목록 응답 형식이 올바르지 않습니다.');
  }
  return { ...data, totalCount: Number(data.totalCount), totalPages: Number(data.totalPages) };
}
