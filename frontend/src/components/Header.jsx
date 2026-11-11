//헤더(네비 바) 컴포넌트
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/Header.css";

import logo from "../assets/logo.png";

function Header() {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const isCommunityActivity = location.pathname === "/mypage/posts" || location.pathname === "/mypage/comments";

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Tales Room 로고" />
          <span>Tales Room</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/posts" className={({ isActive }) => (isActive || isCommunityActivity ? "active" : undefined)}>커뮤니티</NavLink>
          <NavLink to="/themes">테마 탐색</NavLink>
          <NavLink to="/recruitment">모집</NavLink>
          {/* 내 파티: 마감된 모집 중 내가 속한 파티 목록 (비로그인이면 RequireAuth가 로그인 화면으로 보냄) */}
          <NavLink to="/parties">내 파티</NavLink>
        </div>

        {/* 로그인 상태에 따라 프로필 또는 로그인 / 회원가입 표시 */}
        {isLoggedIn ? (
          <Link to="/mypage" className="user-menu" aria-label="마이페이지">
            <span className="header-avatar" aria-hidden="true">{Array.from(user?.nickname?.trim() || '나')[0]}</span>
            <span>마이페이지</span>
          </Link>
        ) : (
          <div className="auth-links" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to="/login" className="login-link"> 로그인 </Link>
            <Link to="/signup" className="signup-link"> 회원가입 </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
