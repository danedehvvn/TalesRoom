import client from './client';

// 게시글 상세 조회 API (조회수 증가 및 본문 데이터 반환)
export const getPostDetail = async (id) => {
    const response = await client.get(`/api/posts/${id}`);
    return response.data.data || response.data;
};