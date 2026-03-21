const Progress = require('../models/Progress');

// @desc  Log progress entry
// @route POST /api/progress
const addProgress = async (req, res) => {
  try {
    const { date, weight, bodyFat, muscleMass, waist, chest, hips, steps, water, sleep, mood, notes } = req.body;
    // Upsert – one entry per day
    const log = await Progress.findOneAndUpdate(
      { user: req.user._id, date },
      { user: req.user._id, date, weight, bodyFat, muscleMass, waist, chest, hips, steps, water, sleep, mood, notes },
      { upsert: true, new: true }
    );
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get progress history
// @route GET /api/progress
const getProgressHistory = async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const logs = await Progress.find({ user: req.user._id })
      .sort({ date: -1 }).limit(parseInt(limit));
    res.json(logs.reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get latest progress
// @route GET /api/progress/latest
const getLatestProgress = async (req, res) => {
  try {
    const log = await Progress.findOne({ user: req.user._id }).sort({ date: -1 });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addProgress, getProgressHistory, getLatestProgress };
