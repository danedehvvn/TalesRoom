const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const partyController = require('../controllers/partyController');

router.get('/', authMiddleware, partyController.getMyList);
router.get('/:id', authMiddleware, partyController.getDetail);
router.post('/:id/comments', authMiddleware, partyController.createComment);

module.exports = router;