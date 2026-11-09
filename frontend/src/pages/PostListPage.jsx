// 커뮤니티 게시글 목록 화면 (P-01) — 주소: /posts
// 필터·검색·페이지 값을 주소창(?category=QUESTION&page=2)에 저장해서
// 새로고침하거나 뒤로가기 해도 보던 상태가 그대로 유지되게 만들었어요
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPosts } from "../api/postApi";
import { getErrorMessage, isLoggedIn } from "../api/axiosInstance";
import { CATEGORIES, formatDate } from "../utils/postFormat";
import CategoryBadge from "../components/CategoryBadge";
import Pagination from "../components/Pagination";
import "../styles/PostListPage.css";

const PAGE_SIZE = 10; // 요구사항: 한 페이지 10개

function PostListPage() {
  const navigate = useNavigate(); // 코드로 페이지 이동
  const [searchParams, setSearchParams] = useSearchParams(); // 주소창 ?뒤 값 읽기/쓰기

  // 주소창에서 현재 조건 꺼내기 (없으면 기본값)
  const category = searchParams.get("category") || ""; // "" = 전체
  const keyword = searchParams.get("keyword") || ""; // 검색어
  const page = Number(searchParams.get("page")) || 1; // 문자열 → 숫자, 없으면 1

  const [input, setInput] = useState(keyword); // 검색창에 타이핑 중인 글자 (검색 버튼 누르기 전)
  const [data, setData] = useState(null); // 서버 응답 { notices, items, totalPages ... }
  const [loading, setLoading] = useState(true); // 불러오는 중 여부 → 스켈레톤 표시
  const [error, setError] = useState(""); // 에러 문구
  const [reloadKey, setReloadKey] = useState(0); // "다시 시도" 누를 때 1씩 올려서 useEffect를 다시 실행시키는 용도

  // 주소창 값(category, keyword, page)이 바뀔 때마다 서버에서 다시 불러오기
  useEffect(() => {
    let ignore = false; // 빠르게 필터를 바꿀 때 "이전 요청"의 늦은 응답을 무시하려는 깃발
    setLoading(true);
    setError("");
    // 값이 빈 항목은 undefined로 보내면 axios가 주소에서 빼줘요
    fetchPosts({ category: category || undefined, keyword: keyword || undefined, page, size: PAGE_SIZE })
      .then((result) => { if (!ignore) setData(result); }) // 성공 → 화면 데이터 교체
      .catch((err) => { if (!ignore) setError(getErrorMessage(err, "목록을 불러오지 못했어요.")); })
      .finally(() => { if (!ignore) setLoading(false); }); // 성공·실패 상관없이 로딩 끝
    return () => { ignore = true; }; // 다음 요청이 시작되면 이번 요청 결과는 버림 (정리 함수)
  }, [category, keyword, page, reloadKey]); // 이 값 중 하나라도 바뀌면 다시 실행

  // 주소창 값을 바꾸는 공통 함수. 바꾸면 위 useEffect가 알아서 다시 불러와요
  const updateParams = (next) => {
    const merged = { category, keyword, page: String(page), ...next }; // 기존 값 + 바꿀 값 덮어쓰기
    // 빈 값과 page=1은 주소에서 빼서 깔끔하게 (/posts?category=INFO)
    const clean = Object.fromEntries(Object.entries(merged).filter(([k, v]) => v && !(k === "page" && v === "1")));
    setSearchParams(clean);
  };

  // 카테고리 칩 클릭 → 카테고리 바꾸고 1페이지로
  const handleCategory = (value) => updateParams({ category: value, page: "1" });

  // 검색 제출 (엔터 또는 검색 버튼) → 검색어 반영하고 1페이지로
  const handleSearch = (e) => {
    e.preventDefault(); // form 기본 동작(페이지 새로고침) 막기
    updateParams({ keyword: input.trim(), page: "1" }); // 앞뒤 공백 제거
  };

  // 페이지 번호 클릭 → 페이지 바꾸고 화면 맨 위로
  const handlePage = (n) => {
    updateParams({ page: String(n) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 글쓰기 버튼: 비로그인이면 로그인 화면으로 (요구사항: 쓰기는 로그인 필요)
  const handleWrite = () => navigate(isLoggedIn() ? "/posts/new" : "/login");

  const notices = data?.notices ?? []; // ?. = data가 null이면 에러 대신 undefined, ?? = 그때 기본값 []
  const items = data?.items ?? [];

  return (
    <div className="post-list">
      {/* ① 제목 영역 */}
      <div className="post-list__head">
        <div>
          <p className="post-list__eyebrow">COMMUNITY</p>
          <h1 className="post-list__title">커뮤니티</h1>
          <p className="post-list__subtitle">질문부터 정보 공유까지, 자유롭게 이야기를 나눠요.</p>
        </div>
        <button type="button" className="post-list__write" onClick={handleWrite}>+ 글쓰기</button>
      </div>

      {/* ② 필터 카드: 카테고리 칩 + 정렬 + 검색 */}
      <div className="post-list__filter">
        <div className="post-list__chips">
          {/* "전체" + CATEGORIES 4개를 버튼으로. 선택된 칩은 is-active */}
          {[{ value: "", label: "전체" }, ...CATEGORIES].map((c) => (
            <button
              key={c.value || "ALL"}
              type="button"
              className={`post-list__chip ${category === c.value ? "is-active" : ""}`}
              onClick={() => handleCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
          {/* 정렬은 서버가 최신순만 지원해서 표시용으로만 둬요 */}
          <span className="post-list__sort">최신순</span>
        </div>

        <form className="post-list__search" onSubmit={handleSearch}>
          <input
            type="search"
            value={input} // 입력창 값을 state와 묶기 (제어 컴포넌트)
            onChange={(e) => setInput(e.target.value)} // 타이핑할 때마다 state 갱신
            placeholder="제목이나 내용으로 검색"
            aria-label="게시글 검색"
          />
          <button type="submit">검색</button>
        </form>
      </div>

      {/* ③ 목록 카드 */}
      <div className="post-list__card">
        {loading ? (
          // 불러오는 중: 회색 막대(스켈레톤) 5줄
          Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="post-row post-row--skeleton">
              <span className="skeleton skeleton--badge" />
              <div className="post-row__body">
                <span className="skeleton skeleton--title" />
                <span className="skeleton skeleton--meta" />
              </div>
            </div>
          ))
        ) : error ? (
          // 실패: 에러 문구 + 다시 시도 (reloadKey를 올려 같은 조건으로 재요청)
          <div className="post-list__state">
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((k) => k + 1)}>다시 시도</button>
          </div>
        ) : (
          <>
            {/* 공지: 1페이지에서만 맨 위 고정 */}
            {page === 1 && notices.map((n) => (
              <Link key={`notice-${n.id}`} to={`/posts/${n.id}`} className="post-row post-row--notice">
                <CategoryBadge notice />
                <div className="post-row__body">
                  <p className="post-row__title">{n.title}</p>
                  <p className="post-row__meta">{n.author?.nickname ?? "관리자"} · {formatDate(n.createdAt)}</p>
                </div>
                <span className="post-row__pin">📌 고정</span>
              </Link>
            ))}

            {/* 일반 글이 하나도 없을 때 */}
            {items.length === 0 ? (
              <div className="post-list__state">
                <p>{keyword ? `"${keyword}"에 대한 검색 결과가 없어요.` : "아직 이야기가 없어요. 첫 이야기를 남겨보세요."}</p>
              </div>
            ) : (
              items.map((p) => (
                <Link key={p.id} to={`/posts/${p.id}`} className="post-row">
                  <CategoryBadge category={p.category} />
                  <div className="post-row__body">
                    <p className="post-row__title">
                      {p.isSpoiler && <span className="post-row__spoiler">스포일러</span>}
                      {p.title}
                      {/* 목록 API에 isSolved가 생기면 자동으로 표시 */}
                      {p.isSolved && <span className="post-row__solved">해결됨</span>}
                    </p>
                    <p className="post-row__meta">
                      {p.author?.nickname} · {formatDate(p.createdAt)} · 조회 {p.viewCount}
                      {/* 댓글 수는 API에 있을 때만 (지금 명세엔 없음) */}
                      {p.commentCount != null && ` · 댓글 ${p.commentCount}`}
                    </p>
                  </div>
                  {/* 좋아요 수도 API에 있을 때만 */}
                  {p.likeCount != null && <span className="post-row__like">♡ {p.likeCount}</span>}
                </Link>
              ))
            )}
          </>
        )}
      </div>

      {/* ④ 페이지 번호 */}
      {!loading && !error && <Pagination page={page} totalPages={data?.totalPages} onChange={handlePage} />}
    </div>
  );
}

export default PostListPage;
