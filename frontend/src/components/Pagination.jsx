// 페이지 번호 버튼 (‹ 1 2 3 4 5 ›)
// 게시글 목록, 테마 목록, 내가 쓴 글 등에서 같이 쓸 수 있게 만든 공용 컴포넌트
import "../styles/Pagination.css";

const WINDOW = 5; // 한 번에 보여줄 번호 개수

// props: page = 지금 페이지, totalPages = 전체 페이지 수, onChange = 번호를 눌렀을 때 실행할 함수
function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null; // 페이지가 1개 이하면 아예 안 보여줘요

  // 지금 페이지가 속한 묶음의 시작 번호 (예: 7페이지 → 6, 1~5페이지 → 1)
  const start = Math.floor((page - 1) / WINDOW) * WINDOW + 1;
  const end = Math.min(start + WINDOW - 1, totalPages); // 묶음의 끝 번호 (전체 수를 넘지 않게)
  // start부터 end까지 숫자 배열 만들기 (예: [1, 2, 3, 4, 5])
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {/* 이전 페이지. 1페이지면 비활성화 */}
      <button type="button" className="pagination__arrow" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="이전 페이지">
        ‹
      </button>

      {/* 번호 버튼들. 지금 페이지는 is-active로 보라색 강조 */}
      {numbers.map((n) => (
        <button
          key={n} // 리액트가 목록의 각 항목을 구분하는 값
          type="button"
          className={`pagination__number ${n === page ? "is-active" : ""}`}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined} // 화면 낭독기에 "현재 페이지" 알림
        >
          {n}
        </button>
      ))}

      {/* 다음 페이지. 마지막 페이지면 비활성화 */}
      <button type="button" className="pagination__arrow" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="다음 페이지">
        ›
      </button>
    </nav>
  );
}

export default Pagination;
