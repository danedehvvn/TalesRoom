import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../api/postApi";
import CategoryBadge from "../CategoryBadge";
import { formatDate } from "../../utils/postFormat";

function HomeLatestPosts() {
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    let active = true;

    fetchPosts({ page: 1, size: 5 })
      .then((data) => {
        if (active) setState({ loading: false, items: data?.items || [], error: "" });
      })
      .catch(() => {
        if (active) setState({ loading: false, items: [], error: "최신 게시글을 불러오지 못했어요." });
      });

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <section className="tr-home-section tr-home-posts" aria-labelledby="home-posts-title">
      <div className="tr-home-section-heading tr-home-section-heading--with-link">
        <div>
          <span className="tr-home-section-kicker">COMMUNITY</span>
          <h2 id="home-posts-title">커뮤니티 최신 글</h2>
          <p>방탈출 이야기를 나누고 다른 탈출러의 경험을 만나보세요.</p>
        </div>
        <Link to="/posts">커뮤니티 가기 <span aria-hidden="true">→</span></Link>
      </div>

      <div className="tr-home-post-list">
        {state.loading && <p className="tr-home-panel-state">정보를 불러오는 중이에요.</p>}
        {!state.loading && state.error && (
          <div className="tr-home-panel-state">
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
          <p className="tr-home-panel-state">아직 이야기가 없어요. 첫 이야기를 남겨보세요.</p>
        )}
        {!state.loading && !state.error && state.items.slice(0, 5).map((post) => (
          <Link className="tr-home-post-row" to={`/posts/${post.id}`} key={post.id}>
            <CategoryBadge category={post.category} />
            <span className="tr-home-post-main">
              <strong>
                {post.isSpoiler ? <em>스포일러</em> : null}
                {post.title}
              </strong>
              <small>
                {post.author?.nickname || "익명"} · {formatDate(post.createdAt)} · 조회 {post.viewCount ?? 0} · 댓글 {post.commentCount ?? 0}
              </small>
            </span>
            <span className="tr-home-post-like">♡ {post.likeCount ?? 0}</span>
          </Link>
        ))}
      </div>

      <Link className="tr-home-more-button" to="/posts">커뮤니티 가기</Link>
    </section>
  );
}

export default HomeLatestPosts;
