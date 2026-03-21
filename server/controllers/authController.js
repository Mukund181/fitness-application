const User = require('../models/User');
const { generateToken, calculateBMR, calculateTDEE, calculateGoalCalories, calculateMacros } = require('../config/utils');

// @desc  Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      onboardingComplete: user.onboardingComplete,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        onboardingComplete: user.onboardingComplete,
        goal: user.goal, age: user.age, gender: user.gender,
        height: user.height, weight: user.weight,
        activityLevel: user.activityLevel, targetWeight: user.targetWeight,
        dailyCalorieGoal: user.dailyCalorieGoal,
        proteinGoal: user.proteinGoal, carbsGoal: user.carbsGoal, fatGoal: user.fatGoal,
        bmr: user.bmr, tdee: user.tdee,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Complete onboarding
// @route PUT /api/auth/onboarding
const completeOnboarding = async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, targetWeight } = req.body;
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const dailyCalorieGoal = calculateGoalCalories(tdee, goal);
    const macros = calculateMacros(dailyCalorieGoal, goal, weight);

    const user = await User.findByIdAndUpdate(req.user._id, {
      age, gender, height, weight, activityLevel, goal, targetWeight,
      bmr: Math.round(bmr), tdee, dailyCalorieGoal,
      proteinGoal: macros.protein, carbsGoal: macros.carbs, fatGoal: macros.fat,
      onboardingComplete: true
    }, { new: true }).select('-password');

    res.json({
      ...user.toObject(),
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, targetWeight, name } = req.body;
    let updateData = { name, age, gender, height, weight, activityLevel, goal, targetWeight };

    if (weight && height && age && gender && activityLevel && goal) {
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      const dailyCalorieGoal = calculateGoalCalories(tdee, goal);
      const macros = calculateMacros(dailyCalorieGoal, goal, weight);
      updateData = {
        ...updateData,
        bmr: Math.round(bmr), tdee, dailyCalorieGoal,
        proteinGoal: macros.protein, carbsGoal: macros.carbs, fatGoal: macros.fat
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
    res.json({ ...user.toObject(), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, completeOnboarding, getMe, updateProfile };
