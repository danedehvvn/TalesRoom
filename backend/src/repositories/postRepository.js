const { Post, Comment, User, PostLog } = require('../models');        // index.js에서 관계 설정이 끝난 모델을 가져옴
const { Op, where } = require('sequelize');                         // Op ?? : Sequelize의 조건 연산자

const List_ATTRIBUTES = ['id', 'category', 'title', 'viewCount', 'isSpoiler', 'createdAt'];
const AUTHOR_INCLUDE = {
    model: User,
    as: 'author',
    attributes: [['id', 'userId'], 'nickname'],
};

// 게시글 목록 조회 (공지 제외, 최신순, 작성자 포함)
// async : 비동기 함수 ( DB 조회는 시간이 걸리기 떄문 )

// 1. 페이징 상관 없이 공지 전부 넣기
async function findNotices() {
    return Post.findAll({
        where: { isNotice: 1 },
        attributes: List_ATTRIBUTES,
        include: [AUTHOR_INCLUDE],
        order: [['createdAt', 'DESC']],
    });
}

// 2. 일반 글 및 조건
async function findPage({ category, keyword, limit, offset }) {
    const where = { isNotice: 0 };

    if (category) where.category = category;    // 카테고리 선택 시
    if (keyword) {                              // 키워드 입력 시
        where[Op.or] = [
            { title: { [Op.like]: `%${keyword}%` } },
            { content: { [Op.like]: `%${keyword}%` } }, // % 빠진 거 추가
        ];
    }
    return Post.findAndCountAll({               // 목록과 개수 반환
        where,
        attributes: List_ATTRIBUTES,
        include: [AUTHOR_INCLUDE],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
    });
}

// 게시글 1개 저장 (INSERT)
async function create(data) {
    return Post.create(data);
}

// findByPk = 기본키(id)로 찾기
async function findById(id) {
    return Post.findByPk(id);
}

// 상세 조회를 위한 게시글 + 작성자 + 댓글 목록 조회
async function findByIdWithDetails(id) {
    const { Post, Comment, User } = require('../models'); // PostReaction 제외

    return await Post.findByPk(id, {
        include: [
            // 1. 게시글 작성자 정보
            {
                model: User,
                as: 'author',
                attributes: ['id', 'nickname', 'email', 'role']
            },
            // 2. 댓글 목록 및 댓글 작성자 정보
            {
                model: Comment,
                as: 'comments',
                separate: true,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'nickname', 'email', 'role']
                    }
                ]
            }
            // ★ 좋아요(PostReaction)는 임시로 주석 처리 또는 제외
        ]
    });
}

// 조회수 1 증가 
async function viewCount(post) {
    return post.increment('viewCount');
}

// 글 수정(UPDATE)
async function update(post, data, options) {
    return post.update(data, options);           // 수정 바로 반영
}

// 글 수정 기록 저장
async function createLog(data, options) {
    return PostLog.create(data, options);
}

// 글 삭제, destroy = 찾아 둔 글을 DB에서 지움
async function remove(post) {
    return post.destroy();
}

// 특정 User가 해당 게시글에 좋아요 눌렀는지 확인
async function findReaction(postId, userId) {
    if (!userId) return null;
    return PostReaction.findone({ where: { postId, userId } });
}

module.exports = { findNotices, findPage, create, findById, findByIdWithDetails, viewCount, update, createLog, remove, findReaction};