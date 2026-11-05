const express = require('express');

const themeController = require('../controllers/themeController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 테마 목록·필터는 공개 API
router.get('/', themeController.getList);

// 경로별 추가g
router.get('/:id', themeController.getThemeById);

// 관리자 테마 등록
router.post('/', authMiddleware, themeController.create);

// 관리자 테마 수정
router.put('/:id', authMiddleware, themeController.update);

// 관리자 테마 삭제
router.delete('/:id', authMiddleware, themeController.remove);

module.exports = router;