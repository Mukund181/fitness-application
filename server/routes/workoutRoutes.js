const express = require('express');
const router = express.Router();
const { addWorkoutLog, getWorkoutLogsByDate, getAllWorkoutLogs, getWeeklyWorkoutSummary, deleteWorkoutLog } = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', addWorkoutLog);
router.get('/', getAllWorkoutLogs);
router.get('/weekly/:startDate', getWeeklyWorkoutSummary);
router.get('/:date', getWorkoutLogsByDate);
router.delete('/:id', deleteWorkoutLog);

module.exports = router;
