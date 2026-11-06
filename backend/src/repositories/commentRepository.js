const { Comment, Post } = require('../models');

// 게시글 조회
const findPostById = async (postId) => {
    return await Post.findByPk(postId);
};

// 댓글 생성
const createComment = async (content, postId, userId) => {
    return await Comment.create({
        content,
        postId: postId,
        userId: userId
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

// 해당 게시글에 이미 채택된 답변이 있는지 확인
const findAcceptedComment = async (postId) => {
    return await Comment.findOne({
        where: {
            postId,
            isAccepted: 1
        }
    });
};

// 답변 채택
const acceptComment = async (comment) => {

    return await comment.update({
        isAccepted: 1
    });
};


module.exports = { findPostById, createComment, findCommentById, removeComment, findAcceptedComment , acceptComment };