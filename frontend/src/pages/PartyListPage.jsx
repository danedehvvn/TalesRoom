// 내 파티 목록 화면 (PT-01) — 주소: /parties (로그인 필요: App.jsx에서 RequireAuth로 감쌈)
// 마감된 모집 중 내가 파티장이거나 승인된 멤버인 파티만 보여요.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyParties } from "../api/partyApi";
import { getErrorMessage } from "../api/axiosInstance";
import { formatMeetDate, initial } from "../utils/recruitmentFormat";
import "../styles/RecruitmentListPage.css";
import "../styles/RecruitmentPages.css";

export default function PartyListPage() {
  const [parties, setParties] = useState(null); // 서버 응답 배열 (null = 아직 안 옴)
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);        // '다시 시도' 누르면 1씩 올려서 다시 불러오기

  useEffect(() => {
    let ignore = false;                          // 화면을 떠난 뒤 늦게 온 응답은 무시
    setError("");
    fetchMyParties()
      .then((list) => { if (!ignore) setParties(list); })
      .catch((err) => { if (!ignore) setError(getErrorMessage(err, "파티 목록을 불러오지 못했어요.")); });
    return () => { ignore = true; };             // 정리 함수: 다음 요청이 시작되거나 화면을 나가면 실행
  }, [retry]);

  const loading = parties === null && !error;

  return (
    <div className="recruitment-page">
      <header className="recruitment-heading">
        <p className="recruitment-eyebrow">MY PARTY</p>
        <h1>내 파티</h1>
        <p>모집이 마감되어 확정된 파티예요. 멤버끼리만 대화를 나눌 수 있어요.</p>
      </header>

      <div className="recruitment-results-heading">
        <h2>확정된 파티 <span>{parties ? parties.length : "…"}</span></h2>
      </div>

      {loading ? (
        <div className="recruitment-state" role="status"><span className="recruitment-spinner" aria-hidden="true" /><p>파티를 불러오는 중입니다…</p></div>
      ) : error ? (
        <div className="recruitment-state" role="alert">
          <h3>파티 목록을 불러오지 못했습니다.</h3>
          <p>{error}</p>
          <button onClick={() => setRetry((n) => n + 1)}>다시 시도</button>
        </div>
      ) : parties.length === 0 ? (
        <div className="recruitment-state">
          <h3>아직 확정된 파티가 없어요.</h3>
          <p>모집에 신청해서 승인되거나, 직접 모집해서 마감하면 파티가 만들어져요.</p>
          <Link to="/recruitment" className="rp-btn rp-btn--primary">모집 보러 가기</Link>
        </div>
      ) : (
        // 팀원 모집 목록과 같은 카드 모양으로, 카드 전체가 파티 상세로 가는 링크
        <ul className="recruitment-grid">
          {parties.map((p) => (
            <li key={p.id} className="recruitment-card rp-clickable">
              <Link to={`/parties/${p.id}`} className="rp-card-link">
                <div className="recruitment-card-top">
                  {/* 파티장이면 배지 색을 다르게 */}
                  <span className={`recruitment-status ${p.isLeader ? "rp-leader" : "recruitment-status--open"}`}>
                    {p.isLeader ? "내가 파티장" : "파티 멤버"}
                  </span>
                </div>
                <h2>{p.title}</h2>
                <dl className="recruitment-facts">
                  <div><dt><span aria-hidden="true">◷</span> 모임 일시</dt><dd>{formatMeetDate(p.meetDate)}</dd></div>
                  <div><dt>멤버</dt><dd><strong>{p.memberCount}</strong>명</dd></div>
                </dl>
                <div className="recruitment-card-bottom">
                  <div className="recruitment-author">
                    <span className="recruitment-avatar" aria-hidden="true">{initial(p.author?.nickname)}</span>
                    <span>파티장 {p.author?.nickname}</span>
                  </div>
                  <span className="recruitment-remaining">대화방 들어가기 →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
