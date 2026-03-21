const FoodLog = require('../models/FoodLog');

// @desc  Log food
// @route POST /api/food
const addFoodLog = async (req, res) => {
  try {
    const { date, mealType, foodName, quantity, unit, calories, protein, carbs, fat, fiber, sugar, sodium } = req.body;
    const log = await FoodLog.create({
      user: req.user._id, date, mealType, foodName, quantity, unit,
      calories, protein, carbs, fat, fiber, sugar, sodium
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get food logs by date
// @route GET /api/food/:date
const getFoodLogsByDate = async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user._id, date: req.params.date }).sort({ createdAt: 1 });
    const totals = logs.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
      sugar: acc.sugar + item.sugar,
      sodium: acc.sodium + item.sodium
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
    res.json({ logs, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get food logs for a week
// @route GET /api/food/week/:startDate
const getWeeklyFoodLogs = async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    const logs = await FoodLog.find({ user: req.user._id, date: { $in: dates } });
    const weekly = dates.map(date => {
      const dayLogs = logs.filter(l => l.date === date);
      return {
        date,
        calories: dayLogs.reduce((s, l) => s + l.calories, 0),
        protein: dayLogs.reduce((s, l) => s + l.protein, 0),
        carbs: dayLogs.reduce((s, l) => s + l.carbs, 0),
        fat: dayLogs.reduce((s, l) => s + l.fat, 0)
      };
    });
    res.json(weekly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete food log
// @route DELETE /api/food/:id
const deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    if (log.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });
    await log.deleteOne();
    res.json({ message: 'Log removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addFoodLog, getFoodLogsByDate, getWeeklyFoodLogs, deleteFoodLog };
