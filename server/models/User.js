const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  // Onboarding
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate'
  },
  goal: {
    type: String,
    enum: ['fat_loss', 'muscle_gain', 'maintenance', 'endurance'],
    default: 'maintenance'
  },
  targetWeight: { type: Number },
  onboardingComplete: { type: Boolean, default: false },
  // Calculated
  bmr: { type: Number },
  tdee: { type: Number },
  dailyCalorieGoal: { type: Number },
  proteinGoal: { type: Number },
  carbsGoal: { type: Number },
  fatGoal: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
