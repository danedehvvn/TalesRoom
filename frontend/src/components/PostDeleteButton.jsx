// 확인 팝업 → 삭제 요청 → 목록으로 이동까지 이 컴포넌트가 다 처리해요
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";
import { deletePost } from "../api/postApi";
import { getErrorMessage } from "../api/axiosInstance";
import useDialog from "../hooks/useDialog";

// props: postId = 지울 글 번호, className = 상세 화면 쪽 스타일을 입히고 싶을 때
function PostDeleteButton({ postId, className = "" }) {
  const { showAlert } = useDialog();
  const navigate = useNavigate(); // 코드로 페이지를 이동하는 함수
  const [open, setOpen] = useState(false); // 확인 팝업 열림 여부
  const [loading, setLoading] = useState(false); // 삭제 요청 중 여부 (버튼 잠금용)

  // 팝업에서 "삭제하기"를 눌렀을 때
  const handleConfirm = async () => {
    setLoading(true); // 요청 시작 → 버튼 잠금
    try {
      await deletePost(postId); // DELETE /api/posts/:id
      navigate("/posts", { replace: true }); // 삭제된 글로 "뒤로가기" 못 하게 replace로 이동
    } catch (error) {
      setLoading(false); // 실패하면 다시 누를 수 있게
      setOpen(false); // 팝업 닫고
      // 401(로그인 만료) · 403(권한 없음) · 404(이미 삭제됨) 이유를 그대로 안내
      await showAlert(
        getErrorMessage(error, "삭제하지 못했어요. 다시 시도해 주세요."),
      );
    }
  };

  return (
    <>
      {/* 화면에 보이는 "삭제" 글자 버튼 */}
      <button type="button" className={className} onClick={() => setOpen(true)}>
        삭제
      </button>

      {/* 디자인 가이드 04의 "이 글을 삭제할까요?" 팝업 */}
      <ConfirmModal
        open={open}
        title="이 글을 삭제할까요?"
        description="삭제한 내용은 되돌릴 수 없어요."
        confirmText="삭제하기"
        danger
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export default PostDeleteButton;
