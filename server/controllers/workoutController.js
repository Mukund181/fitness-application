const WorkoutLog = require('../models/WorkoutLog');

// MET values for calorie estimation
const MET = {
  strength: 5.0, cardio: 7.0, hiit: 8.0, yoga: 3.0,
  flexibility: 2.5, sports: 6.0, other: 4.0
};

const estimateCaloriesBurned = (category, duration, weight) => {
  return Math.round((MET[category] || 4) * weight * (duration / 60));
};

// @desc  Log workout
// @route POST /api/workout
const addWorkoutLog = async (req, res) => {
  try {
    const { date, workoutName, category, duration, exercises, notes, intensity } = req.body;
    const caloriesBurned = estimateCaloriesBurned(category, duration, req.user.weight || 70);
    const log = await WorkoutLog.create({
      user: req.user._id, date, workoutName, category, duration,
      caloriesBurned, exercises, notes, intensity
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get workout logs by date
// @route GET /api/workout/:date
const getWorkoutLogsByDate = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id, date: req.params.date });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all workout logs (paginated)
// @route GET /api/workout
const getAllWorkoutLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const logs = await WorkoutLog.find({ user: req.user._id })
      .sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
    const total = await WorkoutLog.countDocuments({ user: req.user._id });
    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get weekly workout summary
// @route GET /api/workout/weekly/:startDate
const getWeeklyWorkoutSummary = async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    const logs = await WorkoutLog.find({ user: req.user._id, date: { $in: dates } });
    const weekly = dates.map(date => {
      const dayLogs = logs.filter(l => l.date === date);
      return {
        date,
        sessions: dayLogs.length,
        duration: dayLogs.reduce((s, l) => s + l.duration, 0),
        caloriesBurned: dayLogs.reduce((s, l) => s + l.caloriesBurned, 0)
      };
    });
    res.json(weekly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete workout log
// @route DELETE /api/workout/:id
const deleteWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    if (log.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });
    await log.deleteOne();
    res.json({ message: 'Log removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addWorkoutLog, getWorkoutLogsByDate, getAllWorkoutLogs, getWeeklyWorkoutSummary, deleteWorkoutLog };
