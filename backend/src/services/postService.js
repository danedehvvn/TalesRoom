const postRepository = require('../repositories/postRepository');

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

module.exports = { getPosts };