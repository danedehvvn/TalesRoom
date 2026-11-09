// 게시글 화면에서 같이 쓰는 값과 변환 함수

// 카테고리 목록: 서버 값(value) ↔ 화면 이름(label)
// 순서대로 필터 칩과 글쓰기 선택 버튼에 쓰여요
export const CATEGORIES = [
  { value: "QUESTION", label: "질문" },
  { value: "INFO", label: "정보" },
  { value: "CHAT", label: "수다" },
  { value: "DEBATE", label: "토론" },
];

// 서버 값으로 화면 이름 찾기 (예: "QUESTION" → "질문")
export function categoryLabel(value) {
  const found = CATEGORIES.find((c) => c.value === value); // 배열에서 value가 같은 것 찾기
  return found ? found.label : value; // 없으면 받은 값 그대로
}

// 날짜 문자열 → "2026.11.04" 형태
// 서버는 "2026-11-04T05:59:10.000Z"(세계 표준시)로 주는데, new Date가 한국 시간으로 바꿔 줘요
export function formatDate(iso) {
  if (!iso) return ""; // 값이 없으면 빈칸
  const d = new Date(iso); // 문자열 → 날짜 객체
  const pad = (n) => String(n).padStart(2, "0"); // 한 자리 숫자 앞에 0 붙이기 (4 → "04")
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`; // 월은 0부터 시작해서 +1
}
