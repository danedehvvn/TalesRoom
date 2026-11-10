import { useId, useRef, useState } from "react";
import { setThemeBookmark } from "../api/bookmarkApi";
import { themeError } from "../api/themeApi";
import useAuth from "../hooks/useAuth";
import "../styles/BookmarkButton.css";

export default function BookmarkButton({
  themeId,
  title,
  isBookmarked,
  onChange,
}) {
  const { isLoggedIn } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const inFlight = useRef(false);
  const errorId = useId();
  if (!isLoggedIn) return null;
  const active =
    isBookmarked === true || isBookmarked === 1 || isBookmarked === "1";
  const label = `${title || "테마"} 북마크 ${active ? "해제" : "추가"}`;

  async function toggle() {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const next = await setThemeBookmark(themeId, !active);
      onChange?.(next);
      setNotice(next ? "북마크에 추가했습니다." : "북마크를 해제했습니다.");
    } catch (requestError) {
      setError(themeError(requestError));
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <span className="bookmark-control">
      <button
        type="button"
        className={`bookmark-toggle ${active ? "is-active" : ""}`}
        aria-label={label}
        title={label}
        aria-pressed={active}
        aria-busy={pending}
        aria-describedby={error ? errorId : undefined}
        disabled={pending}
        onClick={toggle}
      >
        <svg
          width="20"
          height="22"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
        </svg>
      </button>
      {error && (
        <span id={errorId} className="bookmark-error" role="alert">
          {error}
        </span>
      )}
      {notice && (
        <span className="bookmark-notice" role="status">
          {notice}
        </span>
      )}
    </span>
  );
}
