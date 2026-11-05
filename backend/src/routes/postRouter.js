const express = require('express');

const router = express.Router();        // 주소 가져옴
const postController = require('../controllers/postController');

router.get('/', postController.getList);

module.exports = router;