const express = require('express');

const router = express.Router();        // 주소 가져옴
const themeController = require('../controllers/themeController');
const themeReviewController = require('../controllers/themeReviewController');


// 경로별 추가
router.get('/', themeController.getThemes); //T-01
router.get('/{:id}', themeController.getThemeById); //T-02

//평점/후기 crud
router.get('/{:id}/ratings', themeReviewController.getThemeReviews); //T-03
//인증 필요!
router.post('/{:id}/ratings', themeReviewController.createThemeReview); //T-04
router.delete('/{:id}/ratings', themeReviewController.deleteThemeReview); //T-05



module.exports = router;