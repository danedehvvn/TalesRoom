import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MyPageHeader from "../components/MyPageHeader";
import CategoryBadge from "../components/CategoryBadge";
import Pagination from "../components/Pagination";
import { getErrorMessage } from "../api/axiosInstance";
import { fetchMyPosts } from "../api/userApi";
import { CATEGORIES, formatDate } from "../utils/postFormat";
import "../styles/MyPage.css";

const PAGE_SIZE = 5;
const FETCH_SIZE = 100;

async function fetchEveryPost() {
  const first = await fetchMyPosts({ page: 1, size: FETCH_SIZE });
  const remainingPages = Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) => index + 2);
  const remaining = await Promise.all(remainingPages.map((page) => fetchMyPosts({ page, size: FETCH_SIZE })));
  return [first, ...remaining].flatMap((result) => result.items);
}

function MyPostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    fetchEveryPost()
      .then((items) => {
        if (!ignore) setPosts(items);
      })
      .catch((requestError) => {
        if (!ignore) setError(getErrorMessage(requestError, "작성한 글을 불러오지 못했어요."));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredPosts = useMemo(
    () => (category ? posts.filter((post) => post.category === category) : posts),
    [category, posts],
  );
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(totalPages, 1));
  const visiblePosts = filteredPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setFilter = (nextCategory) => {
    const next = {};
    if (nextCategory) next.category = nextCategory;
    setSearchParams(next);
  };

  const setPage = (nextPage) => {
    const next = { page: String(nextPage) };
    if (category) next.category = category;
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mypage-shell mypage-shell--activity">
      <MyPageHeader eyebrow="MY ACTIVITY" title="내가 쓴 글" description="내가 작성한 커뮤니티 게시글을 확인할 수 있어요." />

      <section className="mypage-card mypage-list-card">
        <div className="mypage-list-toolbar">
          <div className="mypage-filter-chips">
            {[{ value: "", label: "전체" }, ...CATEGORIES].map((item) => (
              <button key={item.value || "ALL"} type="button" className={category === item.value ? "is-active" : ""} onClick={() => setFilter(item.value)}>
                {item.label}
              </button>
            ))}
          </div>
          <span>전체 {filteredPosts.length}개</span>
        </div>

        {loading ? (
          <div className="mypage-state">작성한 글을 불러오는 중이에요.</div>
        ) : error ? (
          <div className="mypage-state">{error}</div>
        ) : visiblePosts.length === 0 ? (
          <div className="mypage-state">작성한 게시글이 없습니다.</div>
        ) : (
          <div className="mypage-post-list">
            {visiblePosts.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`} className="mypage-post-row">
                <CategoryBadge category={post.category} />
                <div className="mypage-post-copy">
                  <strong>{post.title}</strong>
                  <span>{formatDate(post.createdAt)} · 조회 {post.viewCount} · 댓글 {post.commentCount}</span>
                </div>
                {post.isSolved ? <span className="mypage-solved">해결됨</span> : <span className="mypage-like">♡ {post.likeCount}</span>}
              </Link>
            ))}
          </div>
        )}
      </section>

      {!loading && !error && <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />}
    </div>
  );
}

export default MyPostsPage;
