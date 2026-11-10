const commentService = require('../services/commentService');

// 1. 댓글 작성 
const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const loginUser = req.user;

        // 로그인 여부 확인 
        if (!loginUser || !loginUser.id) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.'
            });
        }

        // 서비스 호출
        const result = await commentService.createComment(postId, content, loginUser);

        return res.status(201).json({
            success: true,
            data: { id: result.id, author: result.author },
            message: result.message
        });

    } catch (error) {
        console.error('댓글 작성 에러: ', error);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || '서버 내부 오류가 발생했습니다.'
        });
    }
};

// 2. 댓글 삭제
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const loginUser = req.user;

        // 로그인 여부 확인
        if (!loginUser || !loginUser.id) {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.'
            });
        }

        // 서비스 호출
        await commentService.deleteComment(commentId, loginUser);

        return res.status(200).json({
            success: true,
            data: null,
            message: '삭제되었습니다.'
        });

    } catch (error) {
        console.error('댓글 삭제 에러: ', error);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || '서버 내부 오류가 발생했습니다.'
        });
    }
};

//3. 답변 채택
const acceptComment= async(req,res)=>{
    try{
        const commentId=Number(req.params.id); //댓글 번호
        const loginUser=req.user;

        // 로그인 확인
        if (!loginUser || !loginUser.id) {
            return res.status(401).json({
                success: false,
                data: null,
                message: '로그인이 필요합니다.'
            });
        }

        const result= await commentService.acceptComment(commentId, loginUser);
        
        res.status(200).json({success: true, data: result, message:"답변이 채택되었습니다."});

    }catch(error){
        console.error('답변 채택 에러: ', error);
        const status = error.status || 500;
        return res.status(status).json({
            success: false,
            message: error.message || '서버 내부 오류가 발생했습니다.'
        });
    }
}

module.exports = { createComment, deleteComment, acceptComment };
