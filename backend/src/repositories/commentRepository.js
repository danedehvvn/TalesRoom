const { Comment, Post } = require('../models');

// 게시글 조회
const findPostById = async (postId) => {
    return await Post.findByPk(postId);
};

// 댓글 생성
const createComment = async (content, postId, userId) => {
    return await Comment.create({
        content,
        post_Id: postId,
        user_id: userId
    });
};

// ID로 댓글 조회
const findCommentById = async (commentId) => {
    return await Comment.findByPk(commentId);
};

// 댓글 삭제
const removeComment = async (comment) => {
    return await comment.destroy();
};

module.exports = { findPostById, createComment, findCommentById, removeComment };