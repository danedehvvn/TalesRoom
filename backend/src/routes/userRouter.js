const express = require("express");
const userController = require("../controllers/userController"); // 요청 처리할 controller
//const authMiddleware = require("../middlewares/authMiddleware"); // jwt확인하는 미들웨어 인데... 아직 미들웨어가 비어있음
const router = express.Router(); // 주소 가져오기

// router.use(authMiddleware);

router.get("/me", userController.getMyInfo); // 로그인 사용자 기본정보 조회
router.patch("/me", userController.updateMyInfo); // 로그인 사용자 닉,비번 변경
router.get("/me/posts", userController.getMyPosts); //로그인 사용자 게시글 조회
router.get("/me/comments", userController.getMyComments); // 로그인 사용자 댓글 조회

module.exports = router;
