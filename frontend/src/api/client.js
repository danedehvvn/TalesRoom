// axios API 통신 backend 호출
import axios from "axios";

// 기본 URL 설정: .env의 VITE_API_URL(예: http://localhost:3000)을 사용
// 각 API 파일에서는 "/api/..."부터 적는다 (예: client.post("/api/auth/login"))
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });//BF 기본 주소 설정

// 요청 인터셉터하여 요청을 보내기 직전에 로그인 토큰이 있으면 헤더에 추가 → BF의 authMiddleware가 이 헤더(Authorization: Bearer <토큰>)를 검사
// interceptors = 요청과 응답을 가로채서 처리할 수 있는 기능
// localStorage = 브라우저에 데이터를 저장하는 공간, 새로고침해도 데이터 유지
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;