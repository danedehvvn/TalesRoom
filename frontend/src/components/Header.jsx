//헤더(네비 바) 컴포넌트
import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css";

import logo from "../assets/logo.png";

function Header() {
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

        <Link to="/login" className="login-link">
          로그인
        </Link>
      </nav>
    </header>
  );
}

export default Header;