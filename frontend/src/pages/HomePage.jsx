//메인 홈페이지
import "../styles/HomePage.css";
import HallOfFame from "../components/HallOfFame";

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <span className="home-label">ESCAPE ROOM COMMUNITY - TALES ROOM</span>
        <h1>
          탈출의 순간부터,
          <br />
          우리의 이야기는 시작된다.
        </h1>
        <p>
          취향에 맞는 방탈출 테마를 탐색하고,
          <br />
          다른 이용자들과 경험과 질문을 나눠보세요.
        </p>

        <div className="home-actions">
          <a href="/themes" className="home-primary-btn">
            테마 둘러보기
          </a>
          <a href="/posts" className="home-secondary-btn">
            커뮤니티 가기
          </a>
        </div>
      </section>

      {/* 메인 화면에 배치된 명예의 전당 카드 섹션 */}
      <section className="home-section home-hof-section">
        <div className="home-hof-header">
          <h2 className="home-hof-title">🏆 방탈출 명예의 전당</h2>
          <p className="home-hof-desc">최고의 점수를 기록한 명예로운 탈출러들입니다.</p>
        </div>
        <HallOfFame />
      </section>

      <section className="home-theme">
        <div>
          <h2>지금 인기있는 테마</h2>
          <p>다양한 테마 중 마음에 드는 이야기를 찾아보세요.</p>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>테일즈룸만에서 즐길 수 있는 3가지</h2>
          </div>
        </div>

        <div className="home-card-grid">
          <article className="home-card">
            <div className="home-card-icon">🔍</div>
            <h3>다양한 테마</h3>
            <p>장르별로 방탈출 테마를 둘러보세요.</p>
          </article>

          <article className="home-card">
            <div className="home-card-icon">🎯</div>
            <h3>맞춤 필터</h3>
            <p>지역, 인원, 장르로 원하는 테마를 찾아보세요.</p>
          </article>

          <article className="home-card">
            <div className="home-card-icon">⭐</div>
            <h3>평점과 후기</h3>
            <p>다른 이용자들의 평가를 확인해 보세요.</p>
          </article>
        </div>
      </section>

      <section className="home-community">
        <h2>커뮤니티 최신 글</h2>
        <p>
          궁금한 점을 질문하고, 경험을 공유하고,
          <br />
          다른 이용자들의 답변을 확인해 보세요.
        </p>
        <a href="/posts" className="home-primary-btn">
          커뮤니티 둘러보기
        </a>
      </section>
    </div>
  );
}

export default HomePage;