const express = require('express');

const router = express.Router();        // 주소 가져옴
const postController = require('../controllers/postController');

// [임시] 미들웨어
const fakeAuth = (req, res, next) => {
    req.user = { userId: 'test01', role: 'USER'};   // 토큰 검사
    next();                                         // controller로 넘기기
};

router.get('/', postController.getList);                // P-01 목록
router.post('/', fakeAuth, postController.create);      // P-03 작성 : 주소 -> fakeAuth -> create
router.put('/:id', fakeAuth, postController.update);    // P-04 수정

module.exports = router;