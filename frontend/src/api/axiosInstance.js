// 모든 API 요청이 같이 쓰는 axios 설정 파일 (팀 공용)
// 이 파일 하나에서 서버 주소와 로그인 토큰을 관리하면, 각 API 파일은 경로만 적으면 돼요.
import axios from "axios"; // HTTP 요청을 보내는 라이브러리

// 로그인 토큰을 저장하는 localStorage 키 이름 (로그인 페이지도 이 이름으로 저장해야 해요)
export const TOKEN_KEY = "token";
// 로그인한 회원 정보 { id, nickname, email, role }를 저장하는 키 이름
export const USER_KEY = "user";

// axios.create = 기본 설정이 들어간 axios 복사본 만들기
const serverUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL: serverUrl
    ? `${serverUrl}/api`
    : "/api",
});

// 요청 인터셉터 = 모든 요청이 서버로 나가기 직전에 실행되는 함수
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY); // 저장된 토큰 꺼내기
  if (token) {
    // 토큰이 있으면 헤더에 "Bearer 토큰"을 붙여요 → 백엔드 authMiddleware가 이걸 검사해요
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // 수정한 설정으로 요청을 계속 보내요
});

// 응답 인터셉터: 토큰 만료 또는 인증 실패 처리
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // 로그인 화면에서 비밀번호를 틀린 경우에는 그대로 오류 메시지를 표시
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

// 서버 에러 응답에서 사용자에게 보여줄 문구를 꺼내는 도우미
// 백엔드 공통 실패 형식 { success: false, data: null, message } 의 message를 사용해요
export function getErrorMessage(error, fallback = "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.") {
  // response가 아예 없다 = 서버까지 못 갔다 (백엔드가 꺼져 있거나 주소가 틀림)
  if (error && !error.response) return "서버에 연결할 수 없어요. 백엔드가 켜져 있는지 확인해 주세요.";
  // 프록시가 백엔드(3000)에 못 붙으면 Vite가 대신 500/502/504를 돌려줘요 (이때는 message가 없음)
  if (!error?.response?.data?.message && error?.response?.status >= 500) return "서버에 연결할 수 없어요. 백엔드가 켜져 있는지 확인해 주세요.";
  return error?.response?.data?.message || fallback; // 백엔드가 보낸 message 우선, 없으면 기본 문구
}

// 로그인한 회원 정보 가져오기 (로그인 페이지가 USER_KEY로 저장해 둔 값)
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY); // 문자열로 저장돼 있어요
    return raw ? JSON.parse(raw) : null; // 객체로 바꿔서 돌려주기, 없으면 null
  } catch {
    return null; // 저장된 값이 깨져 있으면 로그인 안 한 것으로 처리
  }
}

// 토큰이 있으면 로그인한 상태로 봐요
export function isLoggedIn() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export default api; // 다른 파일에서 import api from "./axiosInstance" 로 사용
