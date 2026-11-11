// 내 파티 API 모음 (API 명세서 PT-01 ~ PT-03)
import api from './axiosInstance'; // 서버 주소·토큰이 미리 설정된 axios

const unwrap = (response) => response.data.data; // { success, data, message } 중 data만 꺼내기

// PT-01 내 파티 목록: 내가 파티장이거나 승인된 멤버인 파티 (약속 날짜 가까운 순)
export async function fetchMyParties() {
  return unwrap(await api.get('/parties')); // 배열로 옴 [{ id, title, meetDate, memberCount, capacity, author, isLeader }]
}

// PT-02 파티 상세: 본문 + 멤버 + 대화 (멤버만 200, 아니면 403)
export async function fetchParty(id) {
  return unwrap(await api.get(`/parties/${id}`));
}

// PT-03 파티 대화 쓰기 → { id }
export async function createPartyComment(id, content) {
  return unwrap(await api.post(`/parties/${id}/comments`, { content }));
}
