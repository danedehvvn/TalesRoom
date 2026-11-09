import client from './client';

// 게시글 상세 조회 API (조회수 증가 및 본문 데이터 반환)
export const getPostDetail = async (id) => {
    const response = await client.get(`/api/posts/${id}`);
    return response.data.data || response.data;
};
// 게시글 API 모음 (API 명세서 P-01 ~ P-05)
// 화면 코드는 이 함수들만 부르고, 주소나 요청 방식은 여기서만 관리해요.
import api from "./axiosInstance"; // 서버 주소, 토큰이 미리 설정된 axios

// P-01 게시글 목록·검색: GET /api/posts?category=&keyword=&page=&size=
// params = { category, keyword, page, size } (값이 없는 항목은 axios가 주소에서 빼줘요)
export async function fetchPosts(params) {
  const res = await api.get("/posts", { params }); // ?category=...&page=... 를 자동으로 만들어 줌
  return res.data.data; // 응답 { success, data, message } 중 data = { notices, items, page, ... }
}

// P-02 게시글 상세: GET /api/posts/:id (수정 화면에서 기존 내용을 채울 때 사용)
export async function fetchPost(id) {
  const res = await api.get(`/posts/${id}`); // 백틱(`)으로 주소에 id를 끼워 넣어요
  return res.data.data; // { id, category, title, content, isSpoiler, isNotice, ... }
}

// P-03 게시글 작성: POST /api/posts  body = { category, title, content, isSpoiler, isNotice }
export async function createPost(body) {
  const res = await api.post("/posts", body); // 두 번째 인자가 요청 본문(JSON)
  return res.data.data; // { id: 새 글 번호 }
}

// P-04 게시글 수정: PUT /api/posts/:id  body는 작성과 같은 모양
export async function updatePost(id, body) {
  const res = await api.put(`/posts/${id}`, body);
  return res.data.data; // { id }
}

// P-05 게시글 삭제: DELETE /api/posts/:id
export async function deletePost(id) {
  await api.delete(`/posts/${id}`); // 성공하면 data가 null이라 돌려줄 값이 없어요
}
