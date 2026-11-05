const express = require('express');

const router = express.Router();        // 주소 가져옴
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', postController.getList);                // P-01 목록
router.post('/', authMiddleware, postController.create);      // P-03 작성
router.put('/:id', authMiddleware, postController.update);    // P-04 수정
router.delete('/:id', authMiddleware, postController.remove); // P-05 삭제

module.exports = router;