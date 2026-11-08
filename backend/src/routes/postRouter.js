const express = require('express');

const router = express.Router();        // 주소 가져옴
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', postController.getList);                // P-01 목록
//router.get('/:id', postController.getDetail);           // P-02 상세
router.get('/:id', authMiddleware, postController.getDetail); // P-02 상세(로그인 사용자만 상세 보기로 하여 authMiddleware 추가)
router.post('/', authMiddleware, postController.create);      // P-03 작성
router.put('/:id', authMiddleware, postController.update);    // P-04 수정
router.delete('/:id', authMiddleware, postController.remove); // P-05 삭제
router.post('/:id/like', authMiddleware, postController.toggleLike);//L-01 좋아요 토글

module.exports = router;