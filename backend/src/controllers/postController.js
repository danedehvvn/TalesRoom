const postService = require('../services/postService');

async function getList(req, res) {
  try {                                         // 이 안에서 에러가 나면 바로 catch로 넘어감
    const data = await postService.getPosts(req.query);
    res.status(200).json({ success: true, data, message: 'OK' });
  } catch (err) {                               // err = 발생한 에러 객체
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, data: null, message: err.message });
  }
}

// 게시글 상세 조회 컨트롤러 
async function getDetail(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await postService.getPostDetail(id, req.user);
    res.status(200).json({ success: true, data, message: 'OK' });
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, data: null, message: err.message });
  }
}

async function create(req, res) {
    try {
        const data = await postService. createPost(req.user, req.body); // req.user : 로그인 정보, req.body : 프론트에서 보낸 정보
        
        res.status(201).json({ success: true, data, message: '게시글이 등록되었습니다.'});
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(status).json({ success: false, data: null, message: err.message });
    }
}

async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const data = await postService.updatePost(req.user, id, req.body);
    res.status(200).json({ success: true, data, message: '수정되었습니다.'});   // 수정 성공 시
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, data: null, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const id = Number(req.params.id);             // 글 번호
    await postService.deletePost(req.user, id);
    res.status(200).json({ success: true, data: null, message: '삭제되었습니다.'});   // 명세서
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    res.status(status).json({ success: false, data: null, message: err.message });
  }
}

//좋아요 토글 컨트롤러 (POST /api/posts/:id/like)
// authMiddleware를 통과한 요청만 들어오므로 req.user(로그인한 회원 정보)가 항상 있음
async function toggleLike(req, res) {
  try {
    const id = Number(req.params.id);                           //게시글 번호(문자열 -> 숫자)
    const data = await postService.toggleLike(req.user, id);    //data = { liked: true/false }(좋아요 상태 변경 후의 값)
    const message = data.liked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.';

    res.status(200).json({ success: true, data, message });
  } catch (err) {
    const status = err.status || 500;                           //게시글이 없으면 service에서 404를 던짐(그외 에러는 500)

    if (status === 500) {//그외 에러 콘솔에 확인
      console.error(err);
    }

    res.status(status).json({ success: false, data: null, message: err.message });//에러 메시지 전달
  }
}

module.exports = { getList, getDetail, create, update, remove, toggleLike };