const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  workoutName: { type: String, required: true },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'hiit', 'yoga', 'flexibility', 'sports', 'other'],
    default: 'strength'
  },
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: { type: Number, default: 0 },
  exercises: [
    {
      name: { type: String },
      sets: { type: Number },
      reps: { type: Number },
      weight: { type: Number }, // kg
      duration: { type: Number }, // seconds for timed exercises
      distance: { type: Number } // km for cardio
    }
  ],
  notes: { type: String },
  intensity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
