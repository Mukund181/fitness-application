const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  weight: { type: Number }, // kg
  bodyFat: { type: Number }, // %
  muscleMass: { type: Number }, // kg
  waist: { type: Number }, // cm
  chest: { type: Number }, // cm
  hips: { type: Number }, // cm
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 }, // liters
  sleep: { type: Number, default: 0 }, // hours
  mood: { type: String, enum: ['great', 'good', 'okay', 'bad', 'terrible'] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);
