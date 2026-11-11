// 파티 상세 화면 (PT-02, PT-03) — 주소: /parties/:id (로그인 필요)
// 모집글 본문 + 확정 멤버 + 멤버끼리 대화. 멤버가 아니면 서버가 403을 줘서 안내 문구가 떠요.
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createPartyComment, fetchParty } from "../api/partyApi";
import { getErrorMessage } from "../api/axiosInstance";
import { formatMeetDate, formatShortDate, initial } from "../utils/recruitmentFormat";
import "../styles/RecruitmentListPage.css";
import "../styles/RecruitmentPages.css";

export default function PartyDetailPage() {
  const { id } = useParams();                      // 파티 번호 = 모집글 번호
  const [party, setParty] = useState(null);        // 서버 응답
  const [error, setError] = useState("");          // 불러오기 실패 (403 멤버 아님, 404 없음)
  const [message, setMessage] = useState("");      // 대화 입력값
  const [sending, setSending] = useState(false);   // 전송 중이면 버튼 잠금
  const [sendError, setSendError] = useState("");

  // 파티 불러오기 (처음 + 대화 보낸 뒤 새로고침)
  const load = useCallback(async () => {
    try {
      setParty(await fetchParty(id));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "파티를 불러오지 못했어요."));
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // 대화 보내기 (PT-03)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;                    // 빈 메시지는 무시
    setSending(true);
    setSendError("");
    try {
      await createPartyComment(id, message.trim());
      setMessage("");                               // 입력칸 비우기
      await load();                                 // 새 대화 포함해서 다시 불러오기
    } catch (err) {
      setSendError(getErrorMessage(err, "메시지를 보내지 못했어요."));
    } finally {
      setSending(false);
    }
  };

  if (error) {
    return (
      <div className="recruitment-page">
        <div className="recruitment-state" role="alert">
          <h3>{error}</h3>
          <p><Link to="/parties" className="rp-btn rp-btn--primary">내 파티 목록</Link></p>
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div className="recruitment-page">
        <div className="recruitment-state" role="status"><span className="recruitment-spinner" aria-hidden="true" /><p>파티를 불러오는 중입니다…</p></div>
      </div>
    );
  }

  const leaderId = party.author?.userId; // 멤버 목록에서 파티장 표시용

  return (
    <div className="recruitment-page">
      <Link to="/parties" className="rp-back">← 내 파티</Link>

      {/* ① 파티 정보 (모집글 본문을 그대로 사용, 신청 댓글은 보여주지 않음) */}
      <article className="rp-card">
        <div className="recruitment-card-top">
          <span className="recruitment-status recruitment-status--open">파티 확정</span>
          {party.isLeader && <span className="recruitment-status rp-leader">내가 파티장</span>}
        </div>
        <h1 className="rp-title">{party.title}</h1>
        <dl className="recruitment-facts">
          <div><dt><span aria-hidden="true">◷</span> 모임 일시</dt><dd>{formatMeetDate(party.meetDate)}</dd></div>
          <div><dt>테마</dt><dd>{party.theme ? (
            // 테마 찾기로 고른 테마 → 테마 상세로 이동하는 링크
            <Link to={`/themes/${party.theme.id}`} className="rp-theme-link">{party.theme.title} · {party.theme.storeName}</Link>
          ) : (party.themeName || "테마 미정") /* 직접 쓴 테마는 글자 그대로, 없으면 미정 */}</dd></div>
        </dl>
        <p className="rp-content">{party.content}</p>

        {/* 멤버 칩: 첫 번째가 파티장 */}
        <div className="rp-members">
          <span className="rp-label">멤버 {party.members.length}명</span>
          <ul>
            {party.members.map((m) => (
              <li key={m.userId} className="rp-member">
                <span className="recruitment-avatar" aria-hidden="true">{initial(m.nickname)}</span>
                {m.nickname}
                {m.userId === leaderId && <span className="rp-badge rp-badge--approved">파티장</span>}
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* ② 멤버 대화 */}
      <section className="rp-card" aria-labelledby="chat-title">
        <h2 id="chat-title" className="rp-section-title">파티 대화 <span>{party.comments.length}</span></h2>

        {party.comments.length === 0 ? (
          <p className="rp-empty">첫 메시지로 약속 장소나 시간을 정해 보세요.</p>
        ) : (
          <ul className="rp-list">
            {party.comments.map((c) => (
              <li key={c.id} className="rp-item">
                <span className="recruitment-avatar" aria-hidden="true">{initial(c.author?.nickname)}</span>
                <div className="rp-item-body">
                  <div className="rp-item-meta">
                    <b>{c.author?.nickname}</b>
                    {c.author?.userId === leaderId && <span className="rp-badge rp-badge--approved">파티장</span>}
                    <time>{formatShortDate(c.createdAt)}</time>
                  </div>
                  <p>{c.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {sendError && <p className="rp-submit-error" role="alert">{sendError}</p>}
        <form className="rp-apply" onSubmit={handleSend}>
          <textarea className="rp-input rp-textarea" rows={2} value={message} maxLength={1000}
            onChange={(e) => setMessage(e.target.value)} placeholder="멤버에게 메시지를 남겨 보세요." aria-label="메시지" />
          <button type="submit" className="rp-btn rp-btn--primary" disabled={sending || !message.trim()}>
            {sending ? "보내는 중…" : "보내기"}
          </button>
        </form>
      </section>
    </div>
  );
}
