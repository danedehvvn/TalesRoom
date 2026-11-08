//로그인 페이지 (SCR-13, REQ-USR-004)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import "../styles/LoginPage.css";

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { saveLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 막기

    // 1. 클라이언트 입력값 검사 (NFR-005)
    if (!id.trim() || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    // 2. 서버에 로그인 요청
    setLoading(true);
    setError("");
    try {
      const { token, user } = await login(id.trim(), password);
      saveLogin(token, user);
      navigate("/"); // 로그인 성공 → 메인으로 이동
    } catch (err) {
      // 서버가 보낸 메시지가 있으면 그대로 보여주고, 서버가 꺼져 있으면 안내 문구
      setError(err.response?.data?.message || "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1>로그인</h1>
        <p className="login-subtitle">Tales Room에 오신 것을 환영합니다.</p>

        <label htmlFor="login-id">아이디</label>
        <input
          id="login-id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          autoFocus
        />

        <label htmlFor="login-password">비밀번호</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
        />

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="login-links">
          <Link to="/signup">회원가입</Link>
          <span aria-hidden="true">|</span>
          <Link to="/find-id">아이디 찾기</Link>
          <span aria-hidden="true">|</span>
          <Link to="/reset-password">비밀번호 재설정</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
