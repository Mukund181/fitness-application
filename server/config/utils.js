const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// Mifflin-St Jeor BMR formula
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

const calculateTDEE = (bmr, activityLevel) => Math.round(bmr * activityMultipliers[activityLevel]);

const calculateGoalCalories = (tdee, goal) => {
  switch (goal) {
    case 'fat_loss': return Math.round(tdee - 500);
    case 'muscle_gain': return Math.round(tdee + 300);
    case 'endurance': return Math.round(tdee + 100);
    default: return tdee;
  }
};

const calculateMacros = (calories, goal, weight) => {
  let protein, fat, carbs;
  switch (goal) {
    case 'fat_loss':
      protein = weight * 2.2;
      fat = (calories * 0.25) / 9;
      carbs = (calories - protein * 4 - fat * 9) / 4;
      break;
    case 'muscle_gain':
      protein = weight * 2.5;
      fat = (calories * 0.25) / 9;
      carbs = (calories - protein * 4 - fat * 9) / 4;
      break;
    default:
      protein = weight * 1.8;
      fat = (calories * 0.28) / 9;
      carbs = (calories - protein * 4 - fat * 9) / 4;
  }
  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat)
  };
};

module.exports = { generateToken, calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros };
