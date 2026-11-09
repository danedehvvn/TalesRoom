// 카테고리 배지 (질문 / 정보 / 수다 / 토론 / 공지)
// 목록, 상세, 내가 쓴 글 등 여러 화면에서 같은 모양으로 쓰려고 컴포넌트로 뺐어요
import { categoryLabel } from "../utils/postFormat"; // "QUESTION" → "질문" 변환
import "../styles/CategoryBadge.css";

// props: category = 서버 값("QUESTION" 등), notice = true면 "공지" 배지
function CategoryBadge({ category, notice = false }) {
  // 공지면 notice 스타일, 아니면 카테고리별 스타일 (예: badge--question)
  const type = notice ? "notice" : String(category).toLowerCase();
  const text = notice ? "공지" : categoryLabel(category); // 화면에 보일 글자

  return <span className={`category-badge category-badge--${type}`}>{text}</span>;
}

export default CategoryBadge;
