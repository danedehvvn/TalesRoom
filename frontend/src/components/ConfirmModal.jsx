// 확인 팝업 (예: "이 글을 삭제할까요?")
// 브라우저 기본 confirm() 대신, 디자인 가이드 04의 모양으로 만든 공용 팝업이에요
import { useEffect } from "react";
import "../styles/ConfirmModal.css";

// props
// open: 보일지 여부 / title, description: 문구 / confirmText: 확인 버튼 글자
// danger: true면 빨간 버튼 / loading: 처리 중이면 버튼 잠금 / onConfirm, onCancel: 버튼 동작
function ConfirmModal({ open, title, description, confirmText = "확인", cancelText = "취소", danger = false, loading = false, onConfirm, onCancel }) {
  // 팝업이 열려 있을 때 Esc 키로 닫기
  useEffect(() => {
    if (!open) return undefined; // 닫혀 있으면 아무것도 안 함
    const onKey = (e) => { if (e.key === "Escape" && !loading) onCancel(); }; // Esc → 취소
    window.addEventListener("keydown", onKey); // 키 입력 감시 시작
    return () => window.removeEventListener("keydown", onKey); // 팝업이 닫히면 감시 해제 (정리 함수)
  }, [open, loading, onCancel]); // 이 값들이 바뀔 때마다 다시 연결

  if (!open) return null; // 닫혀 있으면 아무것도 그리지 않아요

  return (
    // 화면 전체를 덮는 반투명 배경. 배경을 누르면 취소
    <div className="confirm-modal__backdrop" onClick={() => !loading && onCancel()}>
      {/* 팝업 상자. 안쪽 클릭이 배경까지 전달되지 않게 막아요 (stopPropagation) */}
      <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="confirm-modal-title" className="confirm-modal__title">{title}</h2>
        {description && <p className="confirm-modal__desc">{description}</p>}

        <div className="confirm-modal__actions">
          {/* 확인 버튼: danger면 빨간색, 처리 중엔 "처리 중…" */}
          <button type="button" className={`confirm-modal__confirm ${danger ? "is-danger" : ""}`} onClick={onConfirm} disabled={loading} autoFocus>
            {loading ? "처리 중…" : confirmText}
          </button>
          {/* 취소 버튼: 글자만 있는 버튼 */}
          <button type="button" className="confirm-modal__cancel" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
