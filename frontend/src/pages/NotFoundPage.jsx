import { Link } from "react-router-dom";
import "../styles/NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <p className="not-found-page__code">404 Error</p>
      <h1 id="not-found-title">페이지를 찾을 수 없습니다.</h1>
      <p>주소가 잘못되었거나 더 이상 존재하지 않는 페이지입니다.</p>
      <Link to="/" replace>
        홈으로 돌아가기
      </Link>
    </section>
  );
}
