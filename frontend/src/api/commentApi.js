import api from "./axiosInstance";

// 특정 게시물의 댓글 목록 조회: GET /api/posts/{postId}/comments
export async function fetchComments(postId) {
  const res = await api.get(`/api/posts/${postId}/comments`);
  return res.data.data || res.data;
}

// 댓글 작성: POST /api/posts/{postId}/comments
export async function createComment(postId, body) {
  const res = await api.post(`/api/posts/${postId}/comments`, body);
  return res.data.data || res.data;
}

// 댓글 삭제: DELETE /api/comments/{commentId}
export async function deleteComment(commentId) {
  const res = await api.delete(`/api/comments/${commentId}`);
  return res.data;
}