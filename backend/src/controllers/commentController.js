const { Comment, Post } = require('../models');

// 1. 댓글 작성 
exports.createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const loginUser = req.user;

        // 1. 로그인 여부 학인 
        if (!loginUser || !loginUser.id) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.'
            });
        }

        // 2. 내용 검증 (1 ~ 1000자 / 빈 값 체크)
        if (!content || content.trim().length === 0 || content.length > 1000) {
            return res.status(400).json({
                success: false,
                message: '내용을 입력해주세요.'
            });
        }

        // 3. 게시글 존재 여부 확인 
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '게시글을 찾을 수 없습니다.'
            });
        }

        // 4. 댓글 생성 (작성자 ID랑 게시글 ID 매핑)
        const newComment = await Comment.create({
            content,
            post_Id: postId,
            user_id: loginUser.id // 로그인한 User
        });

        // 질문 카테고리인 경우 메시지 분기 처리 (필요하면 사용)
        const successMessage = post.category === '질문'
            ? '답변이 등록되었습니다.'
            : '댓글이 등록되었습니다.';

        return res.status(201).json({
            success: true,
            data: { id: newComment.id },
            message: successMessage
        });

    } catch (error) {
        console.error('댓글 작성 에러: ', error);
        res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
    }
};

// 2. 댓글 삭제
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const loginUser = req.user;

        // 1. 로그인 여부 확인 (401 에러)
        if (!loginUser || !loginUser.id) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.'
            });
        }

        // 2. 댓글 존재 여부 확인  
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '댓글을 찾을 수 없습니다.'
            });
        }


        // 3. 채택된 답변인지 확인 (DB 컬럼명에 따라 is_adopted 등으로 체크)
        if (comment.is_adopted) {
            return res.status(400).json({
                success: false,
                message: '채택된 답변은 삭제할 수 없습니다.'
            });
        }

        // 4. 권한 검사 (작성자 본인 또는 관리자)
        const isOwner = comment.user_id === loginUser.id;
        const isAdmin = loginUser.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: '작성자 또는 관리자만 삭제할 수 있습니다.'
            });
        }

        // 5. 조건 통과 시 댓글 삭제 실행 
        await comment.destroy();

        return res.status(200).json({
            success: true,
            data: null,
            message: '삭제되었습니다.'
        });

    } catch (error) {
        console.error('댓글 삭제 에러: ', error);
        res.status(500).json({
            success: false,
            message: '서버 내부 오류가 발생했습니다.'
        });
    }
}