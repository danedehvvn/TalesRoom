const express = require('express');

const themeController = require('../controllers/themeController');

const themeReviewController = require('../controllers/themeReviewController');

const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

const router = express.Router();

// 테마 목록·필터는 공개 API
router.get('/', themeController.getList);

// 경로별 추가g
router.get('/:id', optionalAuthMiddleware, themeController.getThemeById);

// 관리자 테마 등록
router.post('/', authMiddleware, themeController.create);

// 관리자 테마 수정
router.put('/:id', authMiddleware, themeController.update);

// 관리자 테마 삭제
router.delete('/:id', authMiddleware, themeController.remove);

//평점/후기 crud
router.get('/{:id}/ratings', themeReviewController.getThemeReviews); //T-03

router.post('/{:id}/ratings', authMiddleware, themeReviewController.createThemeReview); //T-04
router.delete('/{:id}/ratings', authMiddleware, themeReviewController.deleteThemeReview); //T-05

module.exports = router;
