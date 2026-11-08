// 회원·인증 관련 API
import client from "./client";

// 로그인 (REQ-USR-004) → 성공 시 { token, user } 반환
export async function login(id, password) {
  const res = await client.post("/api/auth/login", { id, password });
  return res.data.data;
}

// 2. 회원가입 (REQ-USR-001) → 성공 시 회원가입 완료 메시지 반환
export async function signup(userData) {
  // 사용자가 입력한 회원 정보(id, password, email, nickname) 전송
  const res = await client.post("/api/auth/signup", userData);
  return res.data;
}