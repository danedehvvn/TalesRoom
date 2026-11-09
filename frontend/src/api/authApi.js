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

//이메일 인증 (회원가입)
// 회원가입 인증번호 요청 -> 입력한 이메일로 6자리 인증번호 발송
export async function requestSignupCode(email) {
  const res = await client.post("/api/auth/signup/request", { email });
  return res.data;   // { success, data: null, message }
}

// 회원가입 인증번호 확인 -> 맞으면 10분 동안 "인증 완료" 상태 (이 안에 가입해야 함)
// code는 문자열로 보낸다 (숫자로 보내면 '012345'의 앞자리 0이 사라짐)
export async function verifySignupCode(email, code) {
  const res = await client.post("/api/auth/signup/verify", { email, code: String(code) });
  return res.data;   // { success, data: null, message }
}

//이메일 인증 (아이디 찾기)
// 아이디 찾기 인증번호 요청 -> 가입된 이메일이면 6자리 인증번호 발송
export async function requestFindIdCode(email) {
  const res = await client.post("/api/auth/find-id/request", { email });
  return res.data;   // { success, data: null, message }
}

// 아이디 찾기 인증번호 확인 -> 맞으면 바로 아이디를 돌려줌
export async function verifyFindIdCode(email, code) {
  const res = await client.post("/api/auth/find-id/verify", { email, code: String(code) });
  return res.data;   // { success, data: { id: 'user01' }, message }
}

//이메일 인증 (비밀번호 재설정)
// 비밀번호 재설정 인증번호 요청 -> 아이디와 이메일이 같은 회원 것이면 6자리 인증번호 발송
export async function requestPasswordCode(id, email) {
  const res = await client.post("/api/auth/password/request", { id, email });
  return res.data;   // { success, data: null, message }
}

// 비밀번호 재설정 -> 인증번호가 맞으면 바로 새 비밀번호로 변경
export async function resetPassword(id, email, code, newPassword) {
  const res = await client.post("/api/auth/password/reset", { id, email, code: String(code), newPassword });
  return res.data;   // { success, data: null, message }
}