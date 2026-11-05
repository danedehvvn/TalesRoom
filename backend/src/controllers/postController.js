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

module.exports = { getList };