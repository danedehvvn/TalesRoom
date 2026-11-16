const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const emailAuthController = require('../controllers/emailAuthController');//이메일 인증 컨트롤러

router.post('/signup', authController.signup);
router.post('/login', authController.login);// 로그인 라우터
router.post('/duplicate', authController.duplicate);// 중복확인(현재 ID) 라우터

//이메일 인증번호 요청 라우터
router.post('/signup/request', emailAuthController.requestSignupCode);     // 회원가입 인증번호 요청
router.post('/find-id/request', emailAuthController.requestFindIdCode);    // 아이디 찾기 인증번호 요청
router.post('/password/request', emailAuthController.requestPasswordCode); // 비밀번호 재설정 인증번호 요청

//이메일 인증번호 확인 라우터
router.post('/signup/verify', emailAuthController.verifySignupCode);       // 회원가입 인증번호 확인
router.post('/find-id/verify', emailAuthController.verifyFindIdCode);      // 아이디 찾기 인증번호 확인
router.post('/password/reset', emailAuthController.resetPassword);         // 비밀번호 재설정

module.exports = router;
