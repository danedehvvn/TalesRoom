// 게시글 좋아요 post_reactions에 DB 작업을 하는 곳
// 없으면 추가, 있으면 삭제 판단은 service에서 하고, 여기서는 DB에 묻고 저장하는 일만 한다.
const { PostReaction } = require('../models');//index.js에서 관계 설정이 끝난 모델을 가져옴

// 특정 회원(로그인한 사용자)이 해당 게시글에 좋아요를 눌렀는지 확인
// 눌렀으면 좋아요 행(객체), 안 눌렀으면 null을 돌려줌
const findReaction = async (postId, userId) => {
    if (!userId) return null;//게시글을 로그인 해야 확인 가능하므로 해당 부분의 처리가 상세에서 추가 되면 삭제 될 부분
    return await PostReaction.findOne({ where: { postId, userId } });
};

// 좋아요 추가 (created_at은 Sequelize가 자동으로 채움)
const createReaction = async (postId, userId) => {
    return await PostReaction.create({ postId, userId });
};

// 좋아요 삭제, findReaction으로 찾아 둔 행을 DB에서 지움
const removeReaction = async (reaction) => {
    return await reaction.destroy();
};

// 해당 게시글의 총 좋아요 수 조회
const countReactions = async (postId) => {
    return await PostReaction.count({ where: { postId }, }); // SELECT COUNT(*) ... WHERE post_id = ?
};

module.exports = { findReaction, createReaction, removeReaction, countReactions };
