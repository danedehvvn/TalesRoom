// 테마 찾기 팝업 — 모집글 쓰기에서 '테마 찾기'를 누르면 열려요.
// 테마 탐색과 같은 API(GET /api/themes, 팀원 themeApi.getThemes)를 그대로 불러와서 검색·선택해요.
import { useEffect, useState } from "react";
import { getThemes } from "../api/themeApi";

const PAGE_SIZE = 8; // 팝업 한 페이지에 보여줄 테마 수

// props: open = 열림 여부, onSelect = 테마를 고르면 실행({ id, title, storeName }), onClose = 닫기
export default function ThemePickerModal({ open, onSelect, onClose }) {
  const [input, setInput] = useState("");     // 검색창에 타이핑 중인 글자
  const [keyword, setKeyword] = useState(""); // 실제로 검색한 단어 (검색 버튼을 눌러야 바뀜)
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null); // { items, totalPages, totalCount }
  const [error, setError] = useState("");

  // 팝업이 열려 있을 때 검색어·페이지가 바뀌면 다시 불러오기
  useEffect(() => {
    if (!open) return undefined;                          // 닫혀 있으면 요청 안 함
    const controller = new AbortController();             // 빠르게 다시 검색하면 이전 요청을 취소하는 도구
    setResult(null);
    setError("");
    // sort: 'latest' = 서버 페이징 그대로 사용 (팀원 getThemes 규칙)
    getThemes({ keyword, page, size: PAGE_SIZE, sort: "latest" }, controller.signal)
      .then(setResult)
      .catch((err) => { if (!controller.signal.aborted) setError(err.response?.data?.message || err.message || "테마를 불러오지 못했어요."); });
    return () => controller.abort();                      // 다음 요청 전·팝업 닫힐 때 이전 요청 취소
  }, [open, keyword, page]);

  // Esc 키로 닫기
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // 정리: 팝업이 닫히면 감시 해제
  }, [open, onClose]);

  if (!open) return null; // 닫혀 있으면 아무것도 그리지 않기

  // 검색 제출 → 1페이지부터 다시
  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(input.trim());
    setPage(1);
  };

  return (
    // 반투명 배경: 누르면 닫기
    <div className="rp-modal-backdrop" onClick={onClose}>
      {/* 팝업 상자: 안쪽 클릭이 배경까지 전달되지 않게 막기 */}
      <div className="rp-modal" role="dialog" aria-modal="true" aria-labelledby="theme-picker-title" onClick={(e) => e.stopPropagation()}>
        <div className="rp-modal-head">
          <h2 id="theme-picker-title">테마 찾기</h2>
          <button type="button" className="rp-modal-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <form className="rp-modal-search" onSubmit={handleSearch}>
          <input className="rp-input" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="테마 이름이나 매장 이름으로 검색" aria-label="테마 검색" autoFocus />
          <button type="submit" className="rp-btn rp-btn--primary">검색</button>
        </form>

        {/* 결과: 로딩 / 에러 / 없음 / 목록 */}
        <div className="rp-modal-body">
          {error ? (
            <p className="rp-empty">{error}</p>
          ) : !result ? (
            <p className="rp-empty">불러오는 중…</p>
          ) : result.items.length === 0 ? (
            <p className="rp-empty">{keyword ? `"${keyword}"에 맞는 테마가 없어요. 직접 쓰기를 이용해 보세요.` : "등록된 테마가 없어요."}</p>
          ) : (
            <ul className="rp-theme-list">
              {result.items.map((t) => {
                const storeName = t.storeName ?? t.store_name; // 목록 API는 store_name, 상세는 storeName이라 둘 다 대응
                return (
                  <li key={t.id}>
                    {/* 항목 전체가 버튼: 누르면 선택하고 팝업 닫기 */}
                    <button type="button" className="rp-theme-option" onClick={() => onSelect({ id: t.id, title: t.title, storeName })}>
                      <b>{t.title}</b>
                      <span>{storeName}</span>
                      <small>
                        {[t.genre, t.minPeople && `${t.minPeople}~${t.maxPeople}인`, t.playTime && `${t.playTime}분`].filter(Boolean).join(" · ")}
                      </small>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 페이지 이동 (2페이지 이상일 때만) */}
        {result && result.totalPages > 1 && (
          <div className="rp-modal-pager">
            <button type="button" className="rp-btn rp-btn--small rp-btn--ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>이전</button>
            <span>{page} / {result.totalPages}</span>
            <button type="button" className="rp-btn rp-btn--small rp-btn--ghost" disabled={page >= result.totalPages} onClick={() => setPage((p) => p + 1)}>다음</button>
          </div>
        )}
      </div>
    </div>
  );
}
