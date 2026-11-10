import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSearchSuggestions } from "../../api/searchApi";
import HomeDoorGraphic from "./HomeDoorGraphic";

const EMPTY_RESULTS = { themes: [], posts: [] };

function HomeHeroSearch() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const options = useMemo(
    () => [
      ...(results.themes || []).map((item) => ({ ...item, type: "theme" })),
      ...(results.posts || []).map((item) => ({ ...item, type: "post" })),
    ],
    [results],
  );

  useEffect(() => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      fetchSearchSuggestions(trimmed, controller.signal)
        .then((data) => {
          setResults({
            themes: Array.isArray(data?.themes) ? data.themes : [],
            posts: Array.isArray(data?.posts) ? data.posts : [],
          });
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setResults(EMPTY_RESULTS);
            setError("검색어 추천을 불러오지 못했어요.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [keyword]);

  useEffect(() => {
    function closeOutside(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);

  function moveTo(item) {
    setOpen(false);
    navigate(item.type === "theme" ? `/themes/${item.id}` : `/posts/${item.id}`);
  }

  function submitSearch(event) {
    event.preventDefault();
    const selected = options[activeIndex] || options[0];

    if (selected) {
      moveTo(selected);
      return;
    }

    const trimmed = keyword.trim();
    if (trimmed) navigate(`/themes?keyword=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(event) {
    if (!open || options.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? options.length - 1 : current - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <section className="tr-home-hero" aria-labelledby="tr-home-title">
      <div className="tr-home-hero-copy">
        <span className="tr-home-eyebrow">ESCAPE ROOM COMMUNITY · TALES ROOM</span>
        <h1 id="tr-home-title">
          탈출의 순간부터,
          <br />
          우리의 이야기는 시작된다.
        </h1>
        <p>
          취향에 맞는 방탈출 테마를 탐색하고,
          <br />
          다른 이용자들과 경험과 질문을 나눠보세요.
        </p>

        <div className="tr-home-search" ref={rootRef}>
          <form className="tr-home-search-form" onSubmit={submitSearch} role="search">
            <span className="tr-home-search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={keyword}
              onChange={(event) => {
                const nextKeyword = event.target.value;
                setKeyword(nextKeyword);
                if (!nextKeyword.trim()) {
                  setResults(EMPTY_RESULTS);
                  setError("");
                  setLoading(false);
                  setActiveIndex(-1);
                }
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="테마명 또는 게시글 제목을 검색해 보세요"
              aria-label="테마와 게시글 검색"
              aria-controls="home-search-suggestions"
              aria-expanded={open}
              autoComplete="off"
            />
            <button type="submit">검색</button>
          </form>

          {open && keyword.trim() && (
            <div className="tr-home-search-panel" id="home-search-suggestions">
              {loading && <p className="tr-home-search-state">추천 검색어를 찾고 있어요.</p>}
              {!loading && error && <p className="tr-home-search-state tr-home-search-state--error">{error}</p>}
              {!loading && !error && options.length === 0 && (
                <p className="tr-home-search-state">일치하는 테마나 게시글이 없어요.</p>
              )}

              {!loading && !error && results.themes?.length > 0 && (
                <div className="tr-home-search-group">
                  <strong>테마</strong>
                  {results.themes.map((item, index) => {
                    const currentIndex = index;
                    return (
                      <button
                        type="button"
                        key={`theme-${item.id}`}
                        className={activeIndex === currentIndex ? "is-active" : ""}
                        onMouseEnter={() => setActiveIndex(currentIndex)}
                        onClick={() => moveTo({ ...item, type: "theme" })}
                      >
                        <span>{item.title}</span>
                        <em>테마</em>
                      </button>
                    );
                  })}
                </div>
              )}

              {!loading && !error && results.posts?.length > 0 && (
                <div className="tr-home-search-group">
                  <strong>게시글</strong>
                  {results.posts.map((item, index) => {
                    const currentIndex = (results.themes?.length || 0) + index;
                    return (
                      <button
                        type="button"
                        key={`post-${item.id}`}
                        className={activeIndex === currentIndex ? "is-active" : ""}
                        onMouseEnter={() => setActiveIndex(currentIndex)}
                        onClick={() => moveTo({ ...item, type: "post" })}
                      >
                        <span>{item.title}</span>
                        <em>게시글</em>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <HomeDoorGraphic />
    </section>
  );
}

export default HomeHeroSearch;
