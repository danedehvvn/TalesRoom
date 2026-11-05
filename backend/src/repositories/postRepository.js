const { Post, User, PostLog } = require('../models');        // index.js에서 관계 설정이 끝난 모델을 가져옴

// 게시글 목록 조회 (공지 제외, 최신순, 작성자 포함)
// async : 비동기 함수 ( DB 조회는 시간이 걸리기 떄문 )
async function findAll() {
    return Post.findAll({
        // where = SQL의 WHERE. 공지가 아닌 글만 (is_notice = 0 )
        where: { isNotice: 0 },

        // attributes = SELECT할 컬럼, 목록에는 본문이 필요 없어서 제외함
        attributes: ['id', 'category', 'title', 'viewCount', 'isSpoiler', 'createdAt'],

        // include = JOIN. 작성자 정보 가져옴
        include: [{
            model: User,
            as: 'author',                   // index에서 관계를 author로 정함
            // ['DB 컬럼', '바꿀 이름'] = 별칭(AS), 명세서가 author: { userId, nickname } 이라 id -> userId
            attributes: [['id', 'userId'], 'nickname'],
        }],

        order: [['createdAt', 'DESC']],
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

// 글 수정(UPDATE)
async function update(post, data, options) {
    return post.update(data,options);           // 수정 바로 반영
}

// 글 수정 기록 저장
async function createLog(data, options) {
    return PostLog.create(data, options);
}

module.exports = { findAll, create, findById, update, createLog };