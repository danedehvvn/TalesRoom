import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Link: 카드 클릭 → 상세, useNavigate: 글쓰기 버튼 이동
import useAuth from "../hooks/useAuth"; // 로그인 여부 (비로그인이면 글쓰기 → 로그인 화면)
import { fetchRecruitments } from "../api/recruitmentApi";
import Pagination from "../components/Pagination";
import "../styles/RecruitmentListPage.css";
import "../styles/RecruitmentPages.css"; // 카드 링크·글쓰기 버튼 스타일

const PAGE_SIZE = 10;
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const meetingFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formattedDate(value, meeting = false) {
  if (!value) return "일정 미정";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "일정 미정"
    : (meeting ? meetingFormatter : dateFormatter).format(date);
}

function RecruitmentCard({ item }) {
  const nickname = item.author?.nickname || "익명";
  const capacity = item.capacity == null ? NaN : Number(item.capacity);
  const count = item.currentCount == null ? NaN : Number(item.currentCount);
  const validCount =
    Number.isInteger(capacity) &&
    capacity > 0 &&
    Number.isInteger(count) &&
    count >= 0;
  const full = validCount && count >= capacity;
  const statuses = {
    OPEN: ["open", "모집 중"],
    CLOSED: ["closed", "모집 마감"],
    CANCELED: ["canceled", "모집 취소"],
  };
  const [statusClass, statusLabel] =
    item.status === "OPEN" && full
      ? ["closed", "정원 마감"]
      : statuses[item.status] || ["unknown", "상태 미정"];
  return (
    // 카드 전체를 상세 화면(/recruitment/:id)으로 가는 링크로 감쌈 (R-03)
    <li className="recruitment-card rp-clickable">
      <Link to={`/recruitment/${item.id}`} className="rp-card-link">
      <div className="recruitment-card-top">
        <span
          className={`recruitment-status recruitment-status--${statusClass}`}
        >
          {statusLabel}
        </span>
        <span className="recruitment-created">
          등록{" "}
          <time dateTime={item.createdAt || undefined}>
            {formattedDate(item.createdAt)}
          </time>
        </span>
      </div>
      {/* 테마를 골랐거나 직접 썼으면 제목 위에 굵게 표시 (고른 테마 우선, 없으면 직접 쓴 이름) */}
      {(item.theme?.title || item.themeName) && (
        <p className="rp-card-theme">{item.theme?.title || item.themeName}</p>
      )}
      <h2>{item.title || "제목 없는 모집글"}</h2>
      <dl className="recruitment-facts">
        <div>
          <dt>
            <span aria-hidden="true">◷</span> 모임 일시
          </dt>
          <dd>
            <time dateTime={item.meetDate || undefined}>
              {formattedDate(item.meetDate, true)}
            </time>
          </dd>
        </div>
        <div>
          <dt>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <circle cx="9" cy="7" r="3" />
              <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v2" />
            </svg>{" "}
            참여 인원
          </dt>
          <dd>
            {validCount ? (
              <>
                <strong>{count}</strong> / {capacity}명
              </>
            ) : (
              "정보 없음"
            )}
          </dd>
        </div>
      </dl>
      <div className="recruitment-card-bottom">
        <div className="recruitment-author">
          <span className="recruitment-avatar" aria-hidden="true">
            {Array.from(nickname)[0]}
          </span>
          <span>{nickname}</span>
        </div>
        {item.status === "OPEN" && validCount && !full && (
          <span className="recruitment-remaining">
            {capacity - count}자리 남았어요
          </span>
        )}
      </div>
      </Link>
    </li>
  );
}

export default function RecruitmentListPage() {
  const navigate = useNavigate();      // 코드로 페이지 이동
  const { isLoggedIn } = useAuth();    // 로그인 여부
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get("page") || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState({});
  const requestKey = `${page}:${retry}`;
  const loading = state.key !== requestKey;
  useEffect(() => {
    const controller = new AbortController();
    fetchRecruitments({ page, size: PAGE_SIZE }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ key: requestKey, data });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            key: requestKey,
            error: error.response
              ? error.response.status >= 500
                ? "서버 오류로 모집글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
                : error.response.data?.message ||
                  "모집글을 불러오지 못했습니다."
              : error.code
                ? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요."
                : error.message,
          });
      });
    return () => controller.abort();
  }, [page, requestKey]);

  function changePage(number) {
    const next = new URLSearchParams(params);
    if (number === 1) next.delete("page");
    else next.set("page", String(number));
    setParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const data = state.data;
  return (
    <div className="recruitment-page">
      <header className="recruitment-heading rp-heading-row">
        <div>
          <p className="recruitment-eyebrow">RECRUITMENT</p>
          <h1>모집</h1>
          <p>함께 탈출할 동료를 모집하고 원하는 파티를 꾸릴 수 있어요.</p>
        </div>
        {/* 모집글 쓰기 (R-01): 비로그인이면 로그인 화면으로 */}
        <button type="button" className="rp-btn rp-btn--primary" onClick={() => navigate(isLoggedIn ? "/recruitment/new" : "/login")}>
          + 모집글 쓰기
        </button>
      </header>
      <section
        className="recruitment-results"
        aria-labelledby="recruitment-results-title"
        aria-busy={loading}
      >
        <div className="recruitment-results-heading">
          <h2 id="recruitment-results-title">
            전체 모집{" "}
            <span>
              {loading
                ? "…"
                : state.error
                  ? "—"
                  : data.totalCount.toLocaleString()}
            </span>
          </h2>
        </div>
        {loading ? (
          <div className="recruitment-state" role="status">
            <span className="recruitment-spinner" aria-hidden="true" />
            <p>모집글을 불러오는 중입니다…</p>
          </div>
        ) : state.error ? (
          <div className="recruitment-state" role="alert">
            <h3>모집 목록을 불러오지 못했습니다.</h3>
            <p>{state.error}</p>
            <button onClick={() => setRetry((value) => value + 1)}>
              다시 시도
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="recruitment-state">
            <h3>
              {page > 1
                ? "이 페이지에 모집글이 없습니다."
                : "아직 등록된 모집글이 없습니다."}
            </h3>
            <p>
              {page > 1
                ? "첫 페이지에서 최신 모집글을 확인해 보세요."
                : "새로운 모집글이 올라오면 이곳에서 확인할 수 있어요."}
            </p>
            {page > 1 && (
              <button onClick={() => changePage(1)}>첫 페이지로</button>
            )}
          </div>
        ) : (
          <ul className="recruitment-grid">
            {data.items.map((item) => (
              <RecruitmentCard key={item.id} item={item} />
            ))}
          </ul>
        )}
        {!loading && !state.error && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={changePage}
          />
        )}
      </section>
    </div>
  );
}
