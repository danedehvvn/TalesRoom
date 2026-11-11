// 동행 모집글 작성 화면 (R-01) — 주소: /recruitment/new (로그인 필요: App.jsx에서 RequireAuth로 감쌈)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRecruitment } from "../api/recruitmentApi";
import { getErrorMessage } from "../api/axiosInstance";
import ThemePickerModal from "../components/ThemePickerModal"; // 테마 찾기 팝업
import "../styles/RecruitmentListPage.css"; // 팀원 목록 화면의 공통 스타일(제목 영역 등) 재사용
import "../styles/RecruitmentPages.css";    // 작성·상세·파티 화면 전용 스타일

const MIN_CAPACITY = 2;  // 서버 규칙과 같게: 작성자 포함 최소 2명
const MAX_CAPACITY = 10; // 최대 10명

// datetime-local 입력칸의 최솟값(지금 시각)을 "YYYY-MM-DDTHH:mm" 모양으로 만들기
function nowForInput() {
  const d = new Date();                                       // 지금
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());       // 브라우저 시간대만큼 보정 (toISOString은 UTC 기준이라서)
  return d.toISOString().slice(0, 16);                        // "2026-11-11T10:30"
}

export default function RecruitmentFormPage() {
  const navigate = useNavigate(); // 코드로 페이지 이동
  // 입력값을 객체 하나로 관리 (capacity 기본 4명 = 방탈출에서 가장 흔한 인원)
  const [form, setForm] = useState({ title: "", content: "", meetDate: "", capacity: 4 });
  const [errors, setErrors] = useState({});         // 칸별 에러 문구
  const [submitError, setSubmitError] = useState(""); // 서버 에러 문구
  const [submitting, setSubmitting] = useState(false); // 등록 중이면 버튼 잠금 (두 번 클릭 방지)
  // 테마: '테마 찾기'로 고른 테마 또는 '직접 쓰기'로 입력한 이름 중 하나만
  const [theme, setTheme] = useState(null);           // 고른 테마 { id, title, storeName } (없으면 null)
  const [manual, setManual] = useState(false);        // '직접 쓰기' 체크 여부
  const [themeName, setThemeName] = useState("");     // 직접 쓴 테마 이름
  const [pickerOpen, setPickerOpen] = useState(false); // 테마 찾기 팝업 열림 여부

  // 직접 쓰기 체크/해제: 체크하면 고른 테마를 비우고, 해제하면 직접 쓴 이름을 비움 (둘 중 하나만 보내기 위해)
  const toggleManual = (checked) => {
    setManual(checked);
    if (checked) setTheme(null);
    else setThemeName("");
    setErrors((prev) => ({ ...prev, theme: "" }));
  };

  // 입력 공통 처리: input의 name으로 어떤 칸인지 구분
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));                     // 그 칸만 바꾸기
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));     // 다시 입력하면 그 칸 에러 지우기
  };

  // 제출 전 검사 (서버도 같은 검사를 하지만, 화면에서 먼저 알려주면 빠르고 친절함)
  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "제목을 입력해 주세요.";
    if (!form.content.trim()) next.content = "내용을 입력해 주세요.";
    if (manual && !themeName.trim()) next.theme = "테마 이름을 입력하거나 직접 쓰기를 해제해 주세요."; // 체크해 놓고 비워 둔 경우
    if (!form.meetDate) next.meetDate = "모임 일시를 선택해 주세요.";
    else if (new Date(form.meetDate) <= new Date()) next.meetDate = "모임 일시는 지금 이후여야 해요.";
    const cap = Number(form.capacity);
    if (!Number.isInteger(cap) || cap < MIN_CAPACITY || cap > MAX_CAPACITY) {
      next.capacity = `인원은 ${MIN_CAPACITY}~${MAX_CAPACITY}명 사이로 정해 주세요.`;
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();                          // form 기본 동작(새로고침) 막기
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;   // 에러가 있으면 중단 (입력값은 그대로 유지)

    setSubmitting(true);
    setSubmitError("");
    try {
      const { id } = await createRecruitment({
        title: form.title.trim(),
        content: form.content.trim(),
        meetDate: new Date(form.meetDate).toISOString(), // 브라우저 시간(한국) → UTC 문자열로 보내서 서버 시간대와 상관없이 정확하게
        capacity: Number(form.capacity),                  // 입력칸 값은 문자열이라 숫자로 변환
        // 테마는 둘 중 하나만: 직접 쓰기면 themeName, 골랐으면 themeId, 둘 다 아니면 안 보냄(=테마 미정)
        ...(manual ? { themeName: themeName.trim() } : theme ? { themeId: theme.id } : {}),
      });
      navigate(`/recruitment/${id}`, { replace: true });  // 방금 만든 글의 상세로 이동 (뒤로가기로 폼에 안 돌아오게 replace)
    } catch (err) {
      setSubmitError(getErrorMessage(err, "모집글을 등록하지 못했어요."));
      setSubmitting(false);                               // 다시 누를 수 있게
    }
  };

  return (
    <div className="recruitment-page">
      <header className="recruitment-heading">
        <p className="recruitment-eyebrow">RECRUITMENT</p>
        <h1>모집글 쓰기</h1>
        <p>날짜와 인원을 정하고 함께 탈출할 동료를 모집해 보세요.</p>
      </header>

      {/* noValidate: 브라우저 기본 경고 대신 우리가 만든 에러 문구 사용 */}
      <form className="rp-card rp-form" onSubmit={handleSubmit} noValidate>
        {/* 테마: '테마 찾기'(테마 탐색 목록에서 고르기) 또는 '직접 쓰기'(체크하면 입력칸) — 선택 사항 */}
        <div className="rp-field">
          <span className="rp-label">테마 <small className="rp-hint">(선택)</small></span>
          <div className="rp-theme-row">
            {/* 직접 쓰기를 체크하면 찾기 버튼은 잠금 */}
            <button type="button" className="rp-btn rp-btn--ghost" onClick={() => setPickerOpen(true)} disabled={manual}>
              {theme ? "다른 테마 찾기" : "테마 찾기"}
            </button>
            <label className="rp-check">
              <input type="checkbox" checked={manual} onChange={(e) => toggleManual(e.target.checked)} />
              직접 쓰기
            </label>
          </div>
          {/* 고른 테마 표시 + ✕로 선택 취소 */}
          {!manual && theme && (
            <div className="rp-theme-chip">
              <b>{theme.title}</b><span>{theme.storeName}</span>
              <button type="button" onClick={() => setTheme(null)} aria-label="선택한 테마 지우기">✕</button>
            </div>
          )}
          {/* 직접 쓰기 입력칸 */}
          {manual && (
            <input className={`rp-input ${errors.theme ? "has-error" : ""}`} value={themeName} maxLength={150} autoFocus
              onChange={(e) => { setThemeName(e.target.value); if (errors.theme) setErrors((prev) => ({ ...prev, theme: "" })); }}
              placeholder="예) 홍대 ○○이스케이프 '꿈' 테마" aria-label="테마 직접 쓰기" />
          )}
          {errors.theme && <p className="rp-error">{errors.theme}</p>}
        </div>

        <div className="rp-field">
          {/* htmlFor ↔ id 연결: 라벨을 눌러도 입력칸으로 커서 이동 */}
          <label className="rp-label" htmlFor="rec-title">제목 <em>*</em></label>
          <input id="rec-title" name="title" className={`rp-input ${errors.title ? "has-error" : ""}`}
            value={form.title} onChange={handleChange} maxLength={200} placeholder="예) 강남 공포 테마 같이 가실 분" />
          {errors.title && <p className="rp-error">{errors.title}</p>}
        </div>

        {/* 일시와 인원은 한 줄에 나란히 (좁은 화면에서는 CSS가 세로로 쌓음) */}
        <div className="rp-row">
          <div className="rp-field">
            <label className="rp-label" htmlFor="rec-date">모임 일시 <em>*</em></label>
            {/* datetime-local = 날짜+시간 고르는 브라우저 기본 입력칸, min으로 과거 선택 막기 */}
            <input id="rec-date" name="meetDate" type="datetime-local" min={nowForInput()}
              className={`rp-input ${errors.meetDate ? "has-error" : ""}`} value={form.meetDate} onChange={handleChange} />
            {errors.meetDate && <p className="rp-error">{errors.meetDate}</p>}
          </div>
          <div className="rp-field">
            <label className="rp-label" htmlFor="rec-capacity">모집 인원 (나 포함) <em>*</em></label>
            <select id="rec-capacity" name="capacity" className={`rp-input ${errors.capacity ? "has-error" : ""}`}
              value={form.capacity} onChange={handleChange}>
              {/* 2~10명 선택지를 배열로 만들어서 option으로 펼치기 */}
              {Array.from({ length: MAX_CAPACITY - MIN_CAPACITY + 1 }, (_, i) => MIN_CAPACITY + i).map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
            {errors.capacity && <p className="rp-error">{errors.capacity}</p>}
          </div>
        </div>

        <div className="rp-field">
          <label className="rp-label" htmlFor="rec-content">내용 <em>*</em></label>
          <textarea id="rec-content" name="content" rows={8} className={`rp-input rp-textarea ${errors.content ? "has-error" : ""}`}
            value={form.content} onChange={handleChange} placeholder="모임 장소, 난이도 선호, 경험 등을 적어 주세요." />
          {errors.content && <p className="rp-error">{errors.content}</p>}
        </div>

        {submitError && <p className="rp-submit-error">{submitError}</p>}

        <div className="rp-actions">
          <Link to="/recruitment" className="rp-btn rp-btn--ghost">취소</Link>
          <button type="submit" className="rp-btn rp-btn--primary" disabled={submitting}>
            {submitting ? "등록 중…" : "모집글 등록"}
          </button>
        </div>
      </form>

      {/* 테마 찾기 팝업: 고르면 저장하고 닫기 */}
      <ThemePickerModal
        open={pickerOpen}
        onSelect={(picked) => { setTheme(picked); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
