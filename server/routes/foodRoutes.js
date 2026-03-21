const express = require('express');
const router = express.Router();
const { addFoodLog, getFoodLogsByDate, getWeeklyFoodLogs, deleteFoodLog } = require('../controllers/foodController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', addFoodLog);
router.get('/week/:startDate', getWeeklyFoodLogs);
router.get('/:date', getFoodLogsByDate);
router.delete('/:id', deleteFoodLog);

module.exports = router;
