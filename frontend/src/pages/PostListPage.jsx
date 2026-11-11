import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPosts } from "../api/postApi";
import { getErrorMessage, isLoggedIn } from "../api/axiosInstance";
import { CATEGORIES, formatDate } from "../utils/postFormat";
import { isSolvedPost, postFlag } from "../utils/communityPost";
import CategoryBadge from "../components/CategoryBadge";
import Pagination from "../components/Pagination";
import SearchAutocomplete from "../components/SearchAutocomplete";
import "../styles/PostListPage.css";

const PAGE_SIZE = 10;

export default function PostListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const keyword = params.get("keyword") || "";
  const rawPage = Number(params.get("page") || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const [state, setState] = useState({});
  const [retry, setRetry] = useState(0);
  const requestKey = JSON.stringify([category, keyword, page, retry]);
  const loading = state.key !== requestKey;

  useEffect(() => {
    let ignore = false;
    fetchPosts({
      category: category || undefined,
      keyword: keyword || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((data) => {
        if (!Array.isArray(data?.items))
          throw new Error("게시글 목록 응답이 올바르지 않습니다.");
        if (!ignore) setState({ key: requestKey, data });
      })
      .catch((error) => {
        if (!ignore)
          setState({
            key: requestKey,
            error: getErrorMessage(error, "목록을 불러오지 못했어요."),
          });
      });
    return () => {
      ignore = true;
    };
  }, [category, keyword, page, requestKey]);

  function update(values) {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) =>
      value && !(key === "page" && value === "1")
        ? next.set(key, value)
        : next.delete(key),
    );
    setParams(next);
  }
  const data = state.data;
  return (
    <div className="post-list">
      <div className="post-list__head">
        <div>
          <p className="post-list__eyebrow">COMMUNITY</p>
          <h1 className="post-list__title">커뮤니티</h1>
          <p className="post-list__subtitle">
            질문부터 정보 공유까지, 자유롭게 이야기를 나눠요.
          </p>
        </div>
        <button
          className="post-list__write"
          onClick={() => navigate(isLoggedIn() ? "/posts/new" : "/login")}
        >
          ＋ 글쓰기
        </button>
      </div>
      <section className="post-list__filter" aria-label="게시글 검색과 필터">
        <div className="post-list__filter-top">
          <div className="post-list__chips">
            {[{ value: "", label: "전체" }, ...CATEGORIES].map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={category === item.value}
                className={`post-list__chip post-list__chip--${item.value.toLowerCase() || "all"} ${category === item.value ? "is-active" : ""}`}
                onClick={() => update({ category: item.value, page: "1" })}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <form
          key={keyword}
          className="post-list__search"
          onSubmit={(event) => {
            event.preventDefault();
            update({
              keyword: new FormData(event.currentTarget).get("keyword").trim(),
              page: "1",
            });
          }}
        >
          <SearchAutocomplete
            type="posts"
            name="keyword"
            initialValue={keyword}
            placeholder="제목 또는 내용으로 검색해 보세요"
            ariaLabel="게시글 검색"
            onSelect={(title) => {
              update({ keyword: title, page: "1" });
            }}
          />
          <button type="submit" aria-label="게시글 검색 실행">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </button>
        </form>
      </section>
      <section
        className="post-list__card"
        aria-label="게시글 목록"
        aria-busy={loading}
      >
        {loading ? (
          <div className="post-list__state" role="status">
            게시글을 불러오는 중입니다…
          </div>
        ) : state.error ? (
          <div className="post-list__state" role="alert">
            <p>{state.error}</p>
            <button onClick={() => setRetry((value) => value + 1)}>
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {page === 1 &&
              (data?.notices || []).map((post) => (
                <Link
                  key={`notice-${post.id}`}
                  to={`/posts/${post.id}`}
                  className="post-row post-row--notice"
                >
                  <CategoryBadge notice />
                  <div className="post-row__body">
                    <p className="post-row__title">{post.title}</p>
                    <p className="post-row__meta">
                      {post.author?.nickname || "운영팀"} ·{" "}
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className="post-row__pin">📌 고정</span>
                </Link>
              ))}
            {!data?.items.length ? (
              <div className="post-list__state">
                {keyword
                  ? `“${keyword}”에 대한 검색 결과가 없습니다.`
                  : "아직 게시글이 없습니다."}
              </div>
            ) : (
              data.items.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="post-row"
                >
                  <CategoryBadge category={post.category} />
                  <div className="post-row__body">
                    <div className="post-row__title">
                      {postFlag(post.isSpoiler) && (
                        <span className="post-row__spoiler">스포일러</span>
                      )}
                      <span className="post-row__title-text">{post.title}</span>
                      {isSolvedPost(post) && (
                        <span className="post-row__solved">해결됨</span>
                      )}
                    </div>
                    <p className="post-row__meta">
                      {post.author?.nickname || "익명"} ·{" "}
                      {formatDate(post.createdAt)} · 조회 {post.viewCount ?? 0}{" "}
                      · 댓글 {post.commentCount ?? 0}
                    </p>
                  </div>
                  <span className="post-row__like">
                    ♡ {post.likeCount ?? 0}
                  </span>
                </Link>
              ))
            )}
          </>
        )}
      </section>
      {!loading && !state.error && (
        <Pagination
          page={page}
          totalPages={data?.totalPages}
          onChange={(number) => {
            update({ page: String(number) });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
