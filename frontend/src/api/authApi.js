// 회원·인증 관련 API
import client from "./client";

// 로그인 (REQ-USR-004) → 성공 시 { token, user } 반환
export async function login(id, password) {
  const res = await client.post("/api/auth/login", { id, password });
  return res.data.data;
}
