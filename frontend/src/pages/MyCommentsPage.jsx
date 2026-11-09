import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MyPageHeader from "../components/MyPageHeader";
import Pagination from "../components/Pagination";
import { getErrorMessage } from "../api/axiosInstance";
import { fetchMyComments } from "../api/userApi";
import { formatDate } from "../utils/postFormat";
import "../styles/MyPage.css";

const PAGE_SIZE = 5;

function MyCommentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchMyComments({ page, size: PAGE_SIZE })
      .then((result) => {
        if (!ignore) setData(result);
      })
      .catch((requestError) => {
        if (!ignore) setError(getErrorMessage(requestError, "작성한 댓글을 불러오지 못했어요."));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  const handlePage = (nextPage) => {
    setLoading(true);
    setError("");
    setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mypage-shell mypage-shell--activity">
      <MyPageHeader eyebrow="MY ACTIVITY" title="내가 쓴 댓글" description="내가 남긴 답변과 댓글을 모아볼 수 있어요." />

      <section className="mypage-card mypage-list-card">
        <div className="mypage-list-toolbar mypage-list-toolbar--comments">
          <strong>전체 댓글 {data?.totalCount ?? 0}개</strong>
          <select aria-label="댓글 정렬" defaultValue="latest">
            <option value="latest">최신순</option>
          </select>
        </div>

        {loading ? (
          <div className="mypage-state">작성한 댓글을 불러오는 중이에요.</div>
        ) : error ? (
          <div className="mypage-state">{error}</div>
        ) : data?.items?.length === 0 ? (
          <div className="mypage-state">작성한 댓글이 없습니다.</div>
        ) : (
          <div className="mypage-comment-list">
            {data?.items?.map((comment) => (
              <Link key={comment.id} to={`/posts/${comment.postId}`} className="mypage-comment-row">
                <div className="mypage-comment-main">
                  <strong>{comment.postTitle}</strong>
                  <p>
                    {comment.content}
                    {comment.isAccepted && <span className="mypage-accepted">✓ 채택됨</span>}
                  </p>
                </div>
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
              </Link>
            ))}
          </div>
        )}
      </section>

      {!loading && !error && <Pagination page={data?.page ?? page} totalPages={data?.totalPages} onChange={handlePage} />}
    </div>
  );
}

export default MyCommentsPage;
