// 동행 모집·파티 화면에서 같이 쓰는 표시용 도우미

// 날짜를 한국 시간으로 보여주는 포맷터 (Intl = 브라우저 내장 국제화 기능)
const meetingFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', // 서버는 UTC로 주니까 한국 시간으로 바꿔서 표시
  month: 'long',          // 11월
  day: 'numeric',         // 20일
  weekday: 'short',       // (목)
  hour: '2-digit',        // 19
  minute: '2-digit',      // 00
  hour12: false,          // 24시간제
});
const shortFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

// 약속 일시: "11월 20일 (목) 19:00"
export function formatMeetDate(value) {
  const date = new Date(value);                                         // 문자열 → Date 객체
  return Number.isNaN(date.getTime()) ? '일정 미정' : meetingFormatter.format(date); // 날짜가 아니면 '일정 미정'
}

// 댓글·대화 시각: "11. 20. 19:00"
export function formatShortDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : shortFormatter.format(date);
}

// 모집글 상태 → [CSS 이름, 화면 문구] (팀원 목록 화면의 배지 색을 그대로 사용)
export function recruitmentStatus(status, full) {
  if (status === 'OPEN' && full) return ['closed', '정원 마감']; // 인원은 찼는데 아직 작성자가 마감 안 누름
  if (status === 'OPEN') return ['open', '모집 중'];
  if (status === 'CLOSED') return ['closed', '모집 마감'];
  if (status === 'CANCELED') return ['canceled', '모집 취소'];
  return ['unknown', '상태 미정'];
}

// 신청 상태 → [CSS 이름, 화면 문구]
export const APPLICATION_STATUS = {
  PENDING: ['pending', '대기 중'],
  APPROVED: ['approved', '승인됨'],
  REJECTED: ['rejected', '거절됨'],
};

// 닉네임 첫 글자 (동그란 프로필 자리에 표시). Array.from = 한글·이모지도 한 글자씩 정확히 자름
export const initial = (nickname) => Array.from(nickname?.trim() || '?')[0];
