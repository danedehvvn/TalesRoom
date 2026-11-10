const express = require("express");
const userController = require("../controllers/userController"); // 요청 처리할 controller
const authMiddleware = require("../middlewares/authMiddleware"); // jwt확인하는 미들웨어 인데... 아직 미들웨어가 비어있음
const router = express.Router(); // 주소 가져오기

router.get("/hall-of-fame", userController.getHallOfFame); // 명예의 전당

router.get("/me", authMiddleware, userController.getMyInfo); // 로그인 사용자 기본정보 조회
router.patch("/me", authMiddleware, userController.updateMyInfo); // 로그인 사용자 닉,비번 변경
router.get("/me/posts", authMiddleware, userController.getMyPosts); //로그인 사용자 게시글 조회
router.get("/me/comments", authMiddleware, userController.getMyComments); // 로그인 사용자 댓글 조회

module.exports = router;
