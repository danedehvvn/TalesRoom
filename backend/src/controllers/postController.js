const postService = require('../services/postService');

async function getList(req, res) {
  try {                                         // 이 안에서 에러가 나면 바로 catch로 넘어가요
    const data = await postService.getPosts();
    res.status(200).json({ success: true, data, message: 'OK' });
  } catch (err) {                               // err = 발생한 에러 객체
    console.error('SQL:', err.sql);             // Sequelize가 만든 실제 SQL (터미널에 출력)
    console.error('원인:', err.message);        // MySQL이 알려준 에러 이유 (터미널에 출력)
    // 500 = 서버 오류. 공통 실패 형식으로 브라우저에도 이유를 보여줘요
    res.status(500).json({ success: false, data: null, message: err.message });
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

module.exports = { getList, create, update };