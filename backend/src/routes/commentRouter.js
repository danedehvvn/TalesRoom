const express = require('express');

const router = express.Router();
const commentController = require('../controllers/commentController');

const authMiddleware = require('../middlewares/authMiddleware');

router.post('/posts/:id/comments', authMiddleware, commentController.createComment);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);
router.patch('/comments/:id/accept', authMiddleware, commentController.acceptComment);

module.exports = router;