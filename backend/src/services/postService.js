const { sequelize } = require('../models');
const postRepository = require('../repositories/postRepository');
const CATEGORIES = ['INFO', 'QUESTION', 'CHAT', 'DEBATE'];          // 카테고리 구분

async function getPosts() {
    const posts = await postRepository.findAll();       // 1. DB에서 글 목록 가져오기
    const items = posts.map((post) => {                 // 2. API 명세서 items 형식으로 바꿈, map = 새 배열 만드는 함수
        const p = post.get({ plain: true});

        return {
            id: p.id,
            category: p.category,
            title: p.title,
            author: p.author,
            viewCount: p.viewCount,
            isSpoiler: p.isSpoiler === 1,               // DB에는 0/1, 명세서에는 true/false라고 되어있다. 오류 나면 확인해볼것
            createdAt : p.createdAt,
        };
    });
    return { items };
}

function httpError(status, message) {
    const err = new Error(message);                     // 사용자 노출 문구
    err.status = status;
    return err;
}

// 작성, 수정 공통 입력 검사
function validatePostBody(user, body) {
    const { category, title, content, isNotice } = body;
    if (!category || !title || !content) throw httpError(400, '필수 값이 누락되었습니다.');
    if (!CATEGORIES.includes(category)) throw httpError(400, '잘못된 카테고리 값입니다.');
    if (title.length > 200) throw httpError(400, '제목은 200자 이하로 입력해주세요.');
    if (isNotice && user.role !== 'ADMIN') throw httpError(403, '공지 설정은 관리자만 가능합니다.');
}

async function createPost(user, body) {                 // user = 로그인한 사람, body(req) = 프론트에서 보낸 값
    const { category, title, content, isSpoiler, isNotice } = body;

    validatePostBody(user, body);   // 공통 검사로 교체하였음

    // 모든 조건 통과 -> 저장
    const post = await postRepository.create({
        userId: user.userId,
        category,
        title,
        content,
        isSpoiler: isSpoiler ? 1 : 0, // true/false -> DB에서 1, 0
        isNotice: isNotice ? 1 : 0,
    });
    return { id: post.id };
}

// 수정 함수
async function updatePost(user, id, body) {
    const post = await postRepository.findById(id);             // 1. 글이 있는지?
    if (!post) throw httpError(404, '게시글을 찾을 수 없습니다.');
    const isOwner = post.userId === user.userId;                // 2. 권한: 작성자 본인인지?
    const isAdminOnNotice = post.isNotice === 1 && user.role === 'ADMIN';
    if (!isOwner && !isAdminOnNotice) throw httpError(403, '작성자만 수정할 수 있습니다.');
    
    validatePostBody(user, body);                               // 3. 입력 검사

    await sequelize.transaction(async (t) => {                // 4. 트랜잭션: 전부 성공 or 전부 취소
        await postRepository.createLog({                        // 4-1. 수정 전 내용 저장
            postId: post.id,
            userId: user.userId,
            category: post.category,
            title: post.title,
            content: post.content,
            isSpoiler: post.isSpoiler,
            isNotice: post.isNotice,
        }, { transaction: t });

        await postRepository.update(post, {
            category: body.category,                              // 4-2. 새 내용으로 수정
            title: body.title,
            content: body.content,
            isSpoiler: body.isSpoiler ? 1 : 0,
            isNotice: body.isNotice ? 1 : 0,
        }, { transaction: t });
    });
    return { id: post.id };
}

module.exports = { getPosts, createPost,updatePost };