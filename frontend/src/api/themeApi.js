import API from './client';

export function responseData(response) {
  if (!response.data || typeof response.data !== 'object' || Array.isArray(response.data)) {
    throw new Error('API 응답 형식이 올바르지 않습니다. 백엔드 주소와 서버 실행 상태를 확인해 주세요.');
  }
  if (response.data.success === false) throw new Error(response.data.message || 'API 요청에 실패했습니다.');
  return response.data.data ?? response.data;
}

function normalizeList(data, size) {
  const totalCount = data.totalCount ?? data.pagination?.totalCount;
  const totalPages = data.totalPages ?? data.pagination?.totalPage ?? Math.ceil(Number(totalCount) / size);
  if (!Array.isArray(data.items) || totalCount == null || !Number.isSafeInteger(Number(totalCount)) || Number(totalCount) < 0 || !Number.isSafeInteger(Number(totalPages)) || Number(totalPages) < 0) {
    throw new Error('테마 목록 응답에 올바른 목록 또는 페이지 정보가 없습니다.');
  }
  return { ...data, totalCount: Number(totalCount), totalPages: Number(totalPages) };
}

export async function getThemes(filters, signal) {
  const { sort, ...query } = filters;
  const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ''));
  const load = async (page, size) => normalizeList(responseData(await API.get('/api/themes', {
    params: { ...params, page, size }, signal,
  })), size);
  if (sort === 'latest') return load(query.page, query.size);

  const first = await load(1, 100);
  let items = [...first.items];
  for (let page = 2; page <= first.totalPages; page += 1) {
    items.push(...(await load(page, 100)).items);
  }
  if (sort === 'rating') items.sort((a, b) => Number(b.avgRating) - Number(a.avgRating) || b.id - a.id);
  if (sort === 'reviews') items.sort((a, b) => Number(b.reviewCount) - Number(a.reviewCount) || b.id - a.id);
  return { items: items.slice((query.page - 1) * query.size, query.page * query.size), totalCount: items.length, totalPages: Math.ceil(items.length / query.size) };
}

export async function getTheme(id, signal) {
  return responseData(await API.get(`/api/themes/${id}`, { signal }));
}

export async function createTheme(values) {
  return responseData(await API.post('/api/themes', values));
}

export async function updateTheme(id, values) {
  return responseData(await API.put(`/api/themes/${id}`, values));
}

export async function deleteTheme(id) {
  return responseData(await API.delete(`/api/themes/${id}`));
}

export async function getThemeReviews(id, signal, page = 1) {
  return normalizeList(responseData(await API.get(`/api/themes/${id}/ratings`, {
    params: { page, size: 10 }, signal,
  })), 10);
}

export async function createThemeReview(id, values) {
  return responseData(await API.post(`/api/themes/${id}/ratings`, values));
}

export async function deleteThemeReview(id, userId) {
  return responseData(await API.delete(`/api/themes/${id}/ratings`, { params: userId ? { userId } : {} }));
}

export function themeError(error) {
  return error.response?.data?.message || error.response?.data?.error || error.message || '요청에 실패했습니다. 다시 시도해 주세요.';
}
