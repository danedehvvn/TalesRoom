const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);// 로그인 라우터
router.post('/duplicate', authController.duplicate);// 중복확인(현재 ID) 라우터

module.exports = router;