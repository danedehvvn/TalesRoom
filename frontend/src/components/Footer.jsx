//푸터

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span className="footer-logo">Tales Room</span>
        {/*임시 텍스트입니다. 실제 링크 연결 없습니다! */}
        <div className="footer-links">
          <a>서비스 소개</a>
          <a>이용약관</a>
          <a>개인정보처리방침</a>
        </div>

        <span className="footer-copy">
          © 2026 기초 2팀 취업할거조
        </span>
      </div>
    </footer>
  );
}

export default Footer;
