require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/workout', require('./routes/workoutRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

// Static data routes
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/recipes', require('./routes/recipesRoutes'));
app.use('/api/supplements', require('./routes/supplementsRoutes'));
app.use('/api/myths', require('./routes/mythsRoutes'));
app.use('/api/workoutsplits', require('./routes/workoutSplitsRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'FitTrack Pro API is running 🚀' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
