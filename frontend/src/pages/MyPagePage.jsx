import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MyPageHeader from "../components/MyPageHeader";
import { getErrorMessage } from "../api/axiosInstance";
import { fetchMyComments, fetchMyInfo, fetchMyPosts } from "../api/userApi";
import { formatDate } from "../utils/postFormat";
import useAuth from "../hooks/useAuth";
import "../styles/MyPage.css";

function MyPagePage() {
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ posts: 0, comments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetchMyInfo(),
      fetchMyPosts({ page: 1, size: 1 }),
      fetchMyComments({ page: 1, size: 1 }),
    ])
      .then(([info, posts, comments]) => {
        if (ignore) return;
        setProfile(info);
        setCounts({ posts: posts.totalCount, comments: comments.totalCount });
      })
      .catch((requestError) => {
        if (!ignore) setError(getErrorMessage(requestError, "마이페이지 정보를 불러오지 못했어요."));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRetry = () => {
    setLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  };

  const initial = Array.from(profile?.nickname?.trim() || "나")[0];

  return (
    <div className="mypage-shell">
      <MyPageHeader eyebrow="MY PAGE" title="마이페이지" description="내 정보와 커뮤니티 활동을 한눈에 확인하세요." />

      {location.state?.message && <p className="mypage-notice" role="status">{location.state.message}</p>}

      {loading ? (
        <div className="mypage-card mypage-state">정보를 불러오는 중이에요.</div>
      ) : error ? (
        <div className="mypage-card mypage-state">
          <p>{error}</p>
          <button type="button" onClick={handleRetry}>다시 시도</button>
        </div>
      ) : (
        <>
          <section className="mypage-card mypage-profile-card">
            <div className="mypage-profile">
              <span className="mypage-avatar" aria-hidden="true">{initial}</span>
              <div>
                <h2>{profile.nickname}</h2>
                <p>{profile.email}</p>
                <span>가입일 {formatDate(profile.createdAt)}</span>
              </div>
            </div>
            <Link to="/mypage/edit" className="mypage-outline-button">내 정보 수정</Link>
          </section>

          <section className="mypage-stats" aria-label="활동 통계">
            <Link to="/mypage/posts" className="mypage-stat-card">
              <span>내가 쓴 글</span>
              <strong>{counts.posts}<small>개</small></strong>
            </Link>
            <Link to="/mypage/comments" className="mypage-stat-card">
              <span>내가 쓴 댓글</span>
              <strong>{counts.comments}<small>개</small></strong>
            </Link>
          </section>

          <section className="mypage-card mypage-activity-card">
            <h2>내 활동</h2>
            <Link to="/mypage/posts" className="mypage-activity-link">
              <span className="mypage-activity-icon" aria-hidden="true">▤</span>
              <span className="mypage-activity-copy">
                <strong>내가 쓴 글 보기</strong>
                <small>작성한 게시글을 확인하고 관리해요.</small>
              </span>
              <span aria-hidden="true">›</span>
            </Link>
            <Link to="/mypage/comments" className="mypage-activity-link">
              <span className="mypage-activity-icon" aria-hidden="true">☷</span>
              <span className="mypage-activity-copy">
                <strong>내가 쓴 댓글 보기</strong>
                <small>커뮤니티에 남긴 답변과 댓글을 확인해요.</small>
              </span>
              <span aria-hidden="true">›</span>
            </Link>
          </section>

          <div className="mypage-bottom-row">
            <button type="button" className="mypage-logout" onClick={handleLogout}>로그아웃</button>
            <p>※ 회원 목록 및 관리자 기능은 관리자 계정에만 표시됩니다.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MyPagePage;
