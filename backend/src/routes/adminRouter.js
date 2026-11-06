const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');    // 로그인 확인
const adminMiddleware = require('../middlewares/adminMiddleware');  // 관리자 확인
const adminControlloer = require('../controllers/adminController');

// 미들웨어는 왼쪽부터 차례대로 실행: 로그인 확인 -> 관리자 확인 -> 컨트롤러
router.get('/users', authMiddleware, adminMiddleware, adminControlloer.getUsers);

module.exports = router;