const express = require("express");
const bookmarkController = require("../controllers/bookmarkController"); // 요청 처리할 controller
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router(); // 주소 가져오기

router.post("/:id", authMiddleware, bookmarkController.createBookmark); // 북마크 추가
router.delete("/:id", authMiddleware, bookmarkController.deleteBookmark); // 북마크 삭제


module.exports = router;
