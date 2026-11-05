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

async function createPost(user, body) {                 // user = 로그인한 사람, body(req) = 프론트에서 보낸 값
    const { category, title, content, isSpoiler, isNotice } = body;

    if (!category || !title || !content){
        throw httpError(400, '필수 값이 누락되었습니다.');    // 필수 값
    }
    if (!CATEGORIES.includes(category)) {
        throw httpError(400, '잘못된 category 값입니다.');  // 배열 안에 있는지
    }
    if (title.length > 200) {
        throw httpError(400, '제목은 200자 이하로 입력해주세요.');  // 제목 길이 제한 (200자 너무 길다, 수정해야겠다.)
    }
    if (isNotice && user.role !== 'ADMIN') {
        throw httpError(403, '공지 설정은 관리자만 가능합니다.');   // 공지는 role=관리자만
    }

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

module.exports = { getPosts, createPost };