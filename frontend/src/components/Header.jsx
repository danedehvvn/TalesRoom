//헤더(네비 바) 컴포넌트
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Header.css";

import logo from "../assets/logo.png";

function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // 로그아웃 (REQ-USR-005): 토큰 삭제 후 메인으로 이동
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Tales Room 로고" />
          <span>Tales Room</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/posts">커뮤니티</NavLink>
          <NavLink to="/themes">테마 탐색</NavLink>
        </div>

        {/* 로그인 상태에 따라 "닉네임 + 로그아웃" 또는 "로그인" 표시 */}
        {isLoggedIn ? (
          <div className="user-menu">
            <span className="user-nickname">{user.nickname}님</span>
            <button type="button" className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
