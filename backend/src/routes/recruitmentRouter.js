const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const recruitmentController = require('../controllers/recruitmentController');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

router.get('/', recruitmentController.getList);
router.get('/:id', optionalAuthMiddleware, recruitmentController.getDetail);
router.post('/', authMiddleware, recruitmentController.create);
router.post('/:id/applications', authMiddleware, recruitmentController.apply);
router.patch('/:id/applications/:applicationId', authMiddleware, recruitmentController.decide);
router.patch('/:id/close', authMiddleware, recruitmentController.close);
router.patch('/:id/cancel', authMiddleware, recruitmentController.cancel); 

module.exports = router;