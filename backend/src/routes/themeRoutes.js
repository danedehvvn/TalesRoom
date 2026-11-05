const express = require('express');

const router = express.Router();        // 주소 가져옴
const themeController = require('../controllers/themeController');

// 경로별 추가
router.get('/', themeController.getThemes);
router.get('/{:id}', themeController.getThemeById);


module.exports = router;