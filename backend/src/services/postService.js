const { sequelize } = require('../models');
const postRepository = require('../repositories/postRepository');
const CATEGORIES = ['INFO', 'QUESTION', 'CHAT', 'DEBATE'];          // 카테고리 구분

function httpError(status, message) {
    const err = new Error(message);                     // 사용자 노출 문구
    err.status = status;
    return err;
}

function toListItem(post) {
    const p = post.get({ plain: true });
    return {
        id: p.id,
        category: p.category,
        title: p.title,
        author: p.author,
        viewCount: p.viewCount,
        isSpoiler: p.isSpoiler === 1,
        createdAt: p.createdAt,
    };
}

// 주소 뒤 값들 문자열로 불러오기
async function getPosts(query) {
    const { category, keyword } = query;

    if (category && !CATEGORIES.includes(category)) {   // 카테고리 검사
        throw httpError(400, '잘못된 카테고리입니다.');
    }
    const page = Math.max(parseInt(query.page, 10) || 1, 1); // 페이지 검사
    const size = Math.min(Math.max(parseInt(query.size, 10) || 10, 1), 50);
    const offset = (page - 1) * size;

    const [notices, result] = await Promise.all([                 // 공지 + 일반글 불러오기
        postRepository.findNotices(),
        postRepository.findPage({
            category,
            keyword: keyword ? keyword.trim() : undefined,        // 공백 제거
            limit: size,
            offset,
        }),
    ]);
    return {                                                      // 명세서 응답 양식
        notices: notices.map(toListItem),
        items: result.rows.map(toListItem),
        page,
        size,
        totalCount: result.count,
        totalPages: Math.ceil(result.count / size),       // 올림
    };
}

// 게시글 상세 조회
async function getPostDetail(id, user) {
    // 1. 게시글 존재 여부 확인
    const post = await postRepository.findById(id);
    if (!post) { throw httpError(404, '게시글을 찾을 수 없습니다.'); }

    // 2. 조회수 1 증가 실행
    await postRepository.viewCount(post);

    // 3. 연관된 작성자, 댓글, 좋아요 데이터가 포함된 상세 정보 조회
    const detailedPost = await postRepository.findByIdWithDetails(id);
    const p = detailedPost.get({plain: true});

    // 좋아요 기능이 아직 구현 전이어서 임시로 해둠 
    const likeCount =0; 
    const liked = false;

    // 4. 로그인 User의 좋아요 누름 여부
    const reaction = await postRepository.findReaction(id, user ? user.id : null);

    // comments 배열에서 채택된 댓글(isAccepted === 1)을 찾아 acceptedId 추출
    const commentsList = p.comments || [];
    const acceptedComment = commentsList.find(c => c.isAccepted === 1 || c.isAccepted === true);
    const acceptedId = acceptedComment ? acceptedComment.id : null;

    // 6. 데이터 조립 및 반환
    return { 
        id: p.id, 
        category: p.category, 
        title: p.title,
        content: p.content,
        isSpoiler: p.isSpoiler === 1,
        isNotice: p.isNotice === 1,
        isSolved: acceptedId !== null, //채택된 ID가 있으면 해결된 글 
        acceptedId:acceptedId,
        viewCount: p.viewCount +1, // +1 조회수 반영
        likeCount: likeCount, // 좋아요 총 갯수 
        liked:liked, // 본인이 좋아요 눌렀는지 여부 
        isMine: user ? p.userId === user.id : false, // 내가 작성한 글인지 여부 
        author: p.author,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        comments: (p.comments || []).map(comment => ({
            id: comment.id,
            content: comment.content,
            isAccepted: comment.id === acceptedId, // 해당 댓글이 채택되었는지 여부
            author: comment.author,
            createdAt: comment.createdAt,
        })),
    };
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
        userId: user.id,
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
    const isOwner = post.userId === user.id;                // 2. 권한: 작성자 본인인지?
    const isAdminOnNotice = post.isNotice === 1 && user.role === 'ADMIN';
    if (!isOwner && !isAdminOnNotice) throw httpError(403, '작성자만 수정할 수 있습니다.');

    validatePostBody(user, body);                               // 3. 입력 검사

    await sequelize.transaction(async (t) => {                // 4. 트랜잭션: 전부 성공 or 전부 취소
        await postRepository.createLog({                        // 4-1. 수정 전 내용 저장
            postId: post.id,
            userId: user.id,
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

// 삭제 함수
async function deletePost(user, id) {
    const post = await postRepository.findById(id);     // 1. 글이 있는지
    if (!post) throw httpError(404, '게시글을 찾을 수 없습니다.');
    const isOwner = post.userId === user.id;        // 2. 권한(삭제는 작성자 또는 관리자)
    const isAdmin = user.role === 'ADMIN';
    if (!isOwner && !isAdmin) throw httpError(403, '작성자 또는 관리자만 삭제할 수 있습니다.');

    await postRepository.remove(post);                  // 3. 삭제
}

module.exports = { getPosts, getPostDetail, createPost, updatePost, deletePost };