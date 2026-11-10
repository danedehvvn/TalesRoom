import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getThemes, themeError } from "../../api/themeApi";
import ThemeThumbnail from "../ThemeThumbnail";

const GENRES = ["전체", "공포", "추리", "감성", "코믹"];

function HomeThemeRecommendations() {
  const [genre, setGenre] = useState("전체");
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    const controller = new AbortController();

    getThemes(
      {
        keyword: "",
        region: "",
        people: "",
        genre: genre === "전체" ? "" : genre,
        sort: "latest",
        page: 1,
        size: 3,
      },
      controller.signal,
    )
      .then((data) => setState({ loading: false, items: data.items || [], error: "" }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({ loading: false, items: [], error: themeError(error) });
        }
      });

    return () => controller.abort();
  }, [genre, retry]);

  const moreLink = genre === "전체" ? "/themes" : `/themes?genre=${encodeURIComponent(genre)}`;

  return (
    <section className="tr-home-section" aria-labelledby="home-themes-title">
      <div className="tr-home-section-heading tr-home-section-heading--with-link">
        <div>
          <span className="tr-home-section-kicker">THEME PICK</span>
          <h2 id="home-themes-title">이런 테마는 어떠신가요?</h2>
          <p>끌리는 장르를 골라 새로운 이야기를 발견해 보세요.</p>
        </div>
        <Link to={moreLink}>다른 테마 둘러보기 <span aria-hidden="true">→</span></Link>
      </div>

      <div className="tr-home-genre-chips" aria-label="테마 장르 선택">
        {GENRES.map((item) => (
          <button
            type="button"
            key={item}
            className={genre === item ? "is-active" : ""}
            aria-pressed={genre === item}
            onClick={() => {
              setState((current) => ({ ...current, loading: true, error: "" }));
              setGenre(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {state.loading && <div className="tr-home-theme-grid" aria-label="테마를 불러오는 중"><span /><span /><span /></div>}
      {!state.loading && state.error && (
        <div className="tr-home-panel-state tr-home-panel-state--card">
          <p>{state.error}</p>
          <button
            type="button"
            onClick={() => {
              setState((current) => ({ ...current, loading: true, error: "" }));
              setRetry((value) => value + 1);
            }}
          >
            다시 시도
          </button>
        </div>
      )}
      {!state.loading && !state.error && state.items.length === 0 && (
        <div className="tr-home-panel-state tr-home-panel-state--card">선택한 장르의 테마가 아직 없어요.</div>
      )}
      {!state.loading && !state.error && state.items.length > 0 && (
        <div className="tr-home-theme-grid">
          {state.items.slice(0, 3).map((theme) => (
            <Link className="tr-home-theme-card" to={`/themes/${theme.id}`} key={theme.id}>
              <div className="tr-home-theme-image">
                <ThemeThumbnail url={theme.thumbnailUrl} />
                <span>{theme.genre || "테마"}</span>
              </div>
              <div className="tr-home-theme-body">
                <h3>{theme.title}</h3>
                <p>
                  {[theme.storeName || theme.store_name, `${theme.minPeople}~${theme.maxPeople}명`, theme.playTime ? `${theme.playTime}분` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div>
                  <strong><span aria-hidden="true">★</span> {Number(theme.avgRating || 0).toFixed(1)}</strong>
                  <small>후기 {Number(theme.reviewCount || 0).toLocaleString()}개</small>
                  <em>난이도 {theme.difficulty || 0}/5</em>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link className="tr-home-more-button" to={moreLink}>다른 테마 둘러보기</Link>
    </section>
  );
}

export default HomeThemeRecommendations;
