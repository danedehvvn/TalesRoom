import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/ConfirmModal.css";

function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  danger = false,
  loading = false,
  showCancel = true,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <dialog
      ref={ref}
      className="confirm-modal"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-busy={loading}
      onCancel={(event) => {
        event.preventDefault();
        if (!loading) onCancel();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || loading) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onCancel();
      }}
    >
      <h2 id={titleId} className="confirm-modal__title">
        {title}
      </h2>
      {description && (
        <p id={descriptionId} className="confirm-modal__desc">
          {description}
        </p>
      )}
      <div className="confirm-modal__actions">
        <button
          type="button"
          className={`confirm-modal__confirm ${danger ? "is-danger" : ""}`}
          onClick={onConfirm}
          disabled={loading}
          autoFocus
        >
          {loading ? "처리 중…" : confirmText}
        </button>
        {showCancel && (
          <button
            type="button"
            className="confirm-modal__cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
        )}
      </div>
    </dialog>,
    document.body,
  );
}

export default ConfirmModal;
