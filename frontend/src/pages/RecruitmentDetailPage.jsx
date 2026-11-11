// 동행 모집글 상세 화면 (R-03 ~ R-07) — 주소: /recruitment/:id
// 누구나 볼 수 있고, 로그인 상태와 내 역할(작성자/신청자/일반)에 따라 버튼이 달라져요.
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  applyRecruitment, cancelRecruitment, closeRecruitment, decideApplication, fetchRecruitment,
} from "../api/recruitmentApi";
import { getErrorMessage } from "../api/axiosInstance";
import useAuth from "../hooks/useAuth";
import ConfirmModal from "../components/ConfirmModal";
import { APPLICATION_STATUS, formatMeetDate, formatShortDate, initial, recruitmentStatus } from "../utils/recruitmentFormat";
import "../styles/RecruitmentListPage.css";
import "../styles/RecruitmentPages.css";

export default function RecruitmentDetailPage() {
  const { id } = useParams();                 // 주소의 :id
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();           // 로그인 여부 (신청 칸 표시용)

  const [data, setData] = useState(null);     // 서버 응답 (모집글 + 신청 목록)
  const [error, setError] = useState("");     // 불러오기 실패 문구
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(""); // 신청 댓글 입력값
  const [busy, setBusy] = useState(false);    // 신청·승인·마감 요청 중이면 버튼 잠금
  const [actionError, setActionError] = useState(""); // 버튼 동작 실패 문구
  const [confirm, setConfirm] = useState(null);       // 열려 있는 확인 팝업 종류: 'close' | 'cancel' | null

  // 상세 불러오기 (처음 + 승인·신청 후 새로고침에 같이 씀) → useCallback으로 함수 재생성 방지
  const load = useCallback(async () => {
    try {
      setData(await fetchRecruitment(id));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "모집글을 불러오지 못했어요.")); // 404 마감·없는 글 문구도 그대로 표시
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]); // 주소의 id가 바뀌면 다시 불러오기

  // 버튼 동작 공통 처리: 요청 → 성공하면 화면 새로고침, 실패하면 문구 표시
  const run = async (action) => {
    setBusy(true);
    setActionError("");
    try {
      await action();   // 실제 요청 (신청, 승인 등)
      await load();     // 바뀐 인원·상태를 다시 받아서 화면 갱신
    } catch (err) {
      setActionError(getErrorMessage(err, "요청을 처리하지 못했어요."));
    } finally {
      setBusy(false);
    }
  };

  // 신청 댓글 보내기 (R-04)
  const handleApply = (e) => {
    e.preventDefault();
    if (!content.trim()) { setActionError("신청 내용을 입력해 주세요."); return; } // 빈 신청 막기
    run(async () => { await applyRecruitment(id, content.trim()); setContent(""); });
  };

  // 마감 확인 → 성공하면 파티 화면으로 이동 (R-06)
  const handleClose = async () => {
    setBusy(true);
    try {
      await closeRecruitment(id);
      navigate(`/parties/${id}`, { replace: true }); // 파티 번호 = 모집글 번호
    } catch (err) {
      setActionError(getErrorMessage(err, "마감하지 못했어요."));
      setBusy(false);
      setConfirm(null);
    }
  };

  // 취소 확인 (R-07) → 같은 화면에서 '모집 취소' 상태로 바뀜
  const handleCancel = () => run(async () => { await cancelRecruitment(id); setConfirm(null); });

  if (loading) {
    return (
      <div className="recruitment-page">
        <div className="recruitment-state" role="status"><span className="recruitment-spinner" aria-hidden="true" /><p>모집글을 불러오는 중입니다…</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruitment-page">
        <div className="recruitment-state" role="alert">
          <h3>{error}</h3>
          {/* 마감된 글이면 파티로 옮겨 갔다는 뜻이라 내 파티로 가는 버튼도 같이 */}
          <p><Link to="/recruitment" className="rp-btn rp-btn--ghost">모집 목록으로</Link> <Link to="/parties" className="rp-btn rp-btn--primary">내 파티 보기</Link></p>
        </div>
      </div>
    );
  }

  const full = data.currentCount >= data.capacity;                 // 인원이 다 찼는지 (작성자 포함)
  const [statusClass, statusLabel] = recruitmentStatus(data.status, full);
  const isOpen = data.status === "OPEN";
  const ownerCanAct = data.isMine && isOpen;                       // 작성자 + 모집 중일 때만 승인·마감·취소
  const pendingCount = data.applications.filter((a) => a.status === "PENDING").length;

  return (
    <div className="recruitment-page">
      <Link to="/recruitment" className="rp-back">← 모집 목록</Link>

      {/* ① 모집글 본문 카드 */}
      <article className="rp-card">
        <div className="recruitment-card-top">
          <span className={`recruitment-status recruitment-status--${statusClass}`}>{statusLabel}</span>
          <span className="recruitment-created">등록 {formatShortDate(data.createdAt)}</span>
        </div>
        <h1 className="rp-title">{data.title}</h1>

        <dl className="recruitment-facts">
          <div><dt><span aria-hidden="true">◷</span> 모임 일시</dt><dd>{formatMeetDate(data.meetDate)}</dd></div>
          <div><dt>참여 인원</dt><dd><strong>{data.currentCount}</strong> / {data.capacity}명</dd></div>
          {/* 테마는 선택 기능 구현 전이라 없으면 '미정' */}
          <div><dt>테마</dt><dd>{data.theme ? (
            // 테마 찾기로 고른 테마 → 테마 상세로 이동하는 링크
            <Link to={`/themes/${data.theme.id}`} className="rp-theme-link">{data.theme.title} · {data.theme.storeName}</Link>
          ) : (data.themeName || "테마 미정") /* 직접 쓴 테마는 글자 그대로, 없으면 미정 */}</dd></div>
        </dl>

        <p className="rp-content">{data.content}</p>

        <div className="recruitment-card-bottom">
          <div className="recruitment-author">
            <span className="recruitment-avatar" aria-hidden="true">{initial(data.author?.nickname)}</span>
            <span>{data.author?.nickname}{data.isMine && " (나)"}</span>
          </div>
          {/* 작성자 전용 버튼: 마감은 인원이 다 찼을 때만 누를 수 있음 */}
          {ownerCanAct && (
            <div className="rp-owner-actions">
              <button type="button" className="rp-btn rp-btn--ghost" onClick={() => setConfirm("cancel")} disabled={busy}>모집 취소</button>
              <button type="button" className="rp-btn rp-btn--primary" onClick={() => setConfirm("close")} disabled={busy || !full}
                title={full ? "" : "인원이 다 차야 마감할 수 있어요"}>
                마감하고 파티 만들기
              </button>
            </div>
          )}
        </div>
        {ownerCanAct && !full && <p className="rp-hint rp-right">신청을 {data.capacity - data.currentCount}명 더 승인하면 마감할 수 있어요.</p>}
      </article>

      {actionError && <p className="rp-submit-error" role="alert">{actionError}</p>}

      {/* ② 신청 댓글 영역 */}
      <section className="rp-card" aria-labelledby="apply-title">
        <h2 id="apply-title" className="rp-section-title">
          신청 <span>{data.applications.length}</span>
          {data.isMine && pendingCount > 0 && <small> · 대기 {pendingCount}건</small>}
        </h2>

        {/* 신청 입력칸: 상황별로 다른 안내 */}
        {data.status === "CANCELED" ? (
          <p className="rp-notice rp-notice--canceled">모집이 취소되어 더 이상 신청할 수 없어요.</p>
        ) : !isLoggedIn ? (
          <p className="rp-notice"><Link to="/login">로그인</Link>하고 신청 댓글을 남겨 보세요.</p>
        ) : data.isMine ? (
          <p className="rp-notice">내 모집글이에요. 아래 신청을 승인하거나 거절해 주세요.</p>
        ) : data.myApplicationStatus ? (
          <p className="rp-notice">신청했어요 · 현재 상태: <b>{APPLICATION_STATUS[data.myApplicationStatus]?.[1]}</b></p>
        ) : full ? (
          <p className="rp-notice">모집 인원이 다 찼어요.</p>
        ) : (
          <form className="rp-apply" onSubmit={handleApply}>
            <textarea className="rp-input rp-textarea" rows={3} value={content} maxLength={1000}
              onChange={(e) => setContent(e.target.value)} placeholder="간단한 자기소개와 함께 신청해 보세요." aria-label="신청 내용" />
            <button type="submit" className="rp-btn rp-btn--primary" disabled={busy}>{busy ? "신청 중…" : "신청하기"}</button>
          </form>
        )}

        {/* 신청 목록 (오래된 순) */}
        {data.applications.length === 0 ? (
          <p className="rp-empty">아직 신청이 없어요.</p>
        ) : (
          <ul className="rp-list">
            {data.applications.map((a) => {
              const [cls, label] = APPLICATION_STATUS[a.status] || ["pending", a.status]; // 상태 배지
              return (
                <li key={a.id} className="rp-item">
                  <span className="recruitment-avatar" aria-hidden="true">{initial(a.applicant?.nickname)}</span>
                  <div className="rp-item-body">
                    <div className="rp-item-meta">
                      <b>{a.applicant?.nickname}</b>
                      <span className={`rp-badge rp-badge--${cls}`}>{label}</span>
                      <time>{formatShortDate(a.createdAt)}</time>
                    </div>
                    <p>{a.content}</p>
                  </div>
                  {/* 작성자 + 모집 중 + 대기 신청일 때만 승인/거절 버튼 */}
                  {ownerCanAct && a.status === "PENDING" && (
                    <div className="rp-item-actions">
                      <button type="button" className="rp-btn rp-btn--small rp-btn--primary" disabled={busy || full}
                        onClick={() => run(() => decideApplication(id, a.id, "APPROVED"))}>승인</button>
                      <button type="button" className="rp-btn rp-btn--small rp-btn--ghost" disabled={busy}
                        onClick={() => run(() => decideApplication(id, a.id, "REJECTED"))}>거절</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 확인 팝업 (기존 공용 ConfirmModal 재사용) */}
      <ConfirmModal
        open={confirm === "close"}
        title="모집을 마감할까요?"
        description="마감하면 승인된 멤버끼리 파티가 만들어지고, 대기·거절된 신청은 지워져요."
        confirmText="마감하기"
        loading={busy}
        onConfirm={handleClose}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        open={confirm === "cancel"}
        title="모집을 취소할까요?"
        description="취소한 모집은 목록에 '모집 취소'로 남고, 더 이상 신청을 받을 수 없어요."
        confirmText="모집 취소"
        danger
        loading={busy}
        onConfirm={handleCancel}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
