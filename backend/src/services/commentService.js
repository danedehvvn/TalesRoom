const commentRepository = require('../repositories/commentRepository');

// 1. 댓글 작성 비즈니스 로직
const createComment = async (postId, content, loginUser) => {
    // 내용 검증 (1 ~ 1000자 / 빈 값 체크)
    if (!content || content.trim().length === 0 || content.length > 1000) {
        const error = new Error('내용을 입력해주세요.');
        error.status = 400;
        throw error;
    }

    // 게시글 존재 여부 확인 
    const post = await commentRepository.findPostById(postId);
    if (!post) {
        const error = new Error('게시글을 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    // 댓글 생성
    const newComment = await commentRepository.createComment(content, postId, loginUser.id);

    // 질문 카테고리인 경우 메시지 분기 처리
    const successMessage = post.category === 'QUESTION'
        ? '답변이 등록되었습니다.'
        : '댓글이 등록되었습니다.';

    return {
        id: newComment.id,
        message: successMessage
    };
};

// 2. 댓글 삭제 비즈니스 로직
const deleteComment = async (commentId, loginUser) => {
    // 댓글 존재 여부 확인  
    const comment = await commentRepository.findCommentById(commentId);
    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.status = 404;
        throw error;
    }

    // 채택된 답변인지 확인
    if (comment.isAccepted) {
        const error = new Error('채택된 답변은 삭제할 수 없습니다.');
        error.status = 400;
        throw error;
    }

    // 권한 검사 (작성자 본인 또는 관리자)
    const isOwner = comment.userId === loginUser.id;
    const isAdmin = loginUser.role === 'admin';

    if (!isOwner && !isAdmin) {
        const error = new Error('작성자 또는 관리자만 삭제할 수 있습니다.');
        error.status = 403;
        throw error;
    }

    // 댓글 삭제 실행 
    await commentRepository.removeComment(comment);
    return true;
};

module.exports = { createComment, deleteComment };