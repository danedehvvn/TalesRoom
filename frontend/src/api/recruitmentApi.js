import api from './axiosInstance';

export async function fetchRecruitments({ page = 1, size = 10 } = {}, signal) {
  const response = await api.get('/recruitments', { params: { page, size }, signal });
  const body = response.data;
  if (body?.success === false) throw new Error(body.message || '모집글을 불러오지 못했습니다.');
  const data = body?.data;
  if (!Array.isArray(data?.items) || data.totalCount == null || data.totalPages == null ||
    !Number.isSafeInteger(Number(data.totalCount)) || Number(data.totalCount) < 0 ||
    !Number.isSafeInteger(Number(data.totalPages)) || Number(data.totalPages) < 0) {
    throw new Error('모집 목록 응답 형식이 올바르지 않습니다.');
  }
  return { ...data, totalCount: Number(data.totalCount), totalPages: Number(data.totalPages) };
}
