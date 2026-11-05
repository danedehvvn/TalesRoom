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

async function create(req, res) {
    try {
        const data = await postService. createPost(req.user, req.body); // req.user : 로그인 정보, req.body : 프론트에서 보낸 정보
        
        res.status(201).json({ success: true, data, message: '게시글이 등록되었습니다.'});
    } catch (err) {
        const status = err.status || 500;
        if (status === 500) console.error(err);
        res.status(stats).json({ success: false, data: null, message: err.message });
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
    res.status(status).json({ success: false, data: null, message: err.messgage });
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

module.exports = { getList, create, update, remove };