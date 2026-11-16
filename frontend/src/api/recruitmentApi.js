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

// ───────── 아래부터 동행 모집 상세·작성·신청·승인·마감·취소 (R-01, R-03 ~ R-07) ─────────
// 응답 형식 { success, data, message } 에서 data만 꺼내 주는 도우미
const unwrap = (response) => response.data.data; // response.data = 서버 JSON, 그 안의 data = 실제 내용

// R-01 모집글 작성: body = { title, content, meetDate, capacity, themeId? } → { id }
export async function createRecruitment(body) {
  return unwrap(await api.post('/recruitments', body)); // POST /api/recruitments
}

// R-03 모집글 상세: 신청 목록·isMine·myApplicationStatus 포함
export async function fetchRecruitment(id) {
  return unwrap(await api.get(`/recruitments/${id}`)); // 토큰이 있으면 axiosInstance가 자동으로 붙여서 isMine 계산
}

// R-04 참여 신청(신청 댓글): content = 신청 내용 → { id, status: 'PENDING' }
export async function applyRecruitment(id, content) {
  return unwrap(await api.post(`/recruitments/${id}/applications`, { content }));
}

// R-05 신청 승인/거절: status = 'APPROVED' | 'REJECTED' → { id, status, currentCount, capacity, isFull }
export async function decideApplication(id, applicationId, status) {
  return unwrap(await api.patch(`/recruitments/${id}/applications/${applicationId}`, { status }));
}

// R-06 모집 마감 → 파티 확정 (인원이 다 찼을 때만 성공)
export async function closeRecruitment(id) {
  return unwrap(await api.patch(`/recruitments/${id}/close`)); // PATCH = 상태(status)만 바꾸는 요청
}

// R-07 모집 취소 → 목록에 '모집 취소' 배지로 남음
export async function cancelRecruitment(id) {
  return unwrap(await api.patch(`/recruitments/${id}/cancel`));
}
