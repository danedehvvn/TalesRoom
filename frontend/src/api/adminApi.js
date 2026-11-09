// 관리자 API 모음 (API 명세서 M-04)
// 화면 코드는 이 함수만 부르고, 주소와 요청 방식은 여기서만 관리해요
import api from "./axiosInstance"; // 서버 주소와 토큰이 미리 설정된 axios (요청마다 Bearer 토큰 자동 첨부)

// M-04 회원 목록: GET /api/admin/users?page=&size=
// 서버가 authMiddleware(로그인 확인) → adminMiddleware(ADMIN 확인) 순서로 검사해요
export async function fetchUsers(params) {
  const res = await api.get("/admin/users", { params }); // params → ?page=1&size=10 으로 자동 변환
  return res.data.data; // { items: [{ userId, email, nickname, role, createdAt }], page, size, totalCount, totalPages }
}
