// 메인 홈페이지
import "../styles/HomePage.css";

import HomeHeroSearch from "../components/home/HomeHeroSearch";
import HomeLeaderboard from "../components/home/HomeLeaderboard";
import HomeThemeRecommendations from "../components/home/HomeThemeRecommendations";
import HomeLatestPosts from "../components/home/HomeLatestPosts";

function HomePage() {
  return (
    <div className="home-page">
      {/* 메인 소개 + 통합 검색 */}
      <HomeHeroSearch />

      {/* 명예의 전당 */}
      <HomeLeaderboard />

      {/* 장르별 추천 테마 */}
      <HomeThemeRecommendations />

      {/* 커뮤니티 최신 게시글 */}
      <HomeLatestPosts />
    </div>
  );
}

export default HomePage;
