import { Link } from "react-router-dom";

function MyPageHeader({ eyebrow, title, description, backToMyPage = false }) {
  return (
    <header className="mypage-heading">
      {backToMyPage && (
        <Link to="/mypage" className="mypage-back-link">
          <span aria-hidden="true">‹</span> 마이페이지로 돌아가기
        </Link>
      )}
      <p className="mypage-heading__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="mypage-heading__description">{description}</p>
    </header>
  );
}

export default MyPageHeader;
