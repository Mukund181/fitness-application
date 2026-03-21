const express = require('express');
const router = express.Router();
const { addProgress, getProgressHistory, getLatestProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', addProgress);
router.get('/', getProgressHistory);
router.get('/latest', getLatestProgress);

module.exports = router;
