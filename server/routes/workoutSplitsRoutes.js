const express = require('express');
const router = express.Router();

const workoutSplits = [
  {
    id: 1, goal: 'fat_loss', name: "Fat Loss HIIT Split",
    description: "High-intensity circuit training combined with strength work to maximize calorie burn and preserve muscle during a deficit.",
    frequency: "4 days/week", difficulty: "Intermediate", duration: "45-50 min/session",
    days: [
      {
        day: "Day 1 - Upper Body HIIT",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "15-20", rest: "30s" },
          { name: "Dumbbell Rows", sets: 4, reps: "12", rest: "30s" },
          { name: "Overhead Press", sets: 3, reps: "12", rest: "45s" },
          { name: "Burpees", sets: 3, reps: "10", rest: "60s" },
          { name: "Mountain Climbers", sets: 3, duration: "30s", rest: "30s" },
          { name: "Jumping Jacks", sets: 3, duration: "45s", rest: "30s" }
        ]
      },
      {
        day: "Day 2 - Lower Body HIIT",
        exercises: [
          { name: "Goblet Squats", sets: 4, reps: "15", rest: "45s" },
          { name: "Jump Squats", sets: 3, reps: "12", rest: "60s" },
          { name: "Romanian Deadlifts", sets: 3, reps: "12", rest: "45s" },
          { name: "Reverse Lunges", sets: 3, reps: "10 each", rest: "30s" },
          { name: "Box Step-ups", sets: 3, reps: "15 each", rest: "30s" },
          { name: "Glute Bridges", sets: 3, reps: "20", rest: "30s" }
        ]
      },
      {
        day: "Day 3 - Rest / Light Cardio",
        exercises: [
          { name: "30-minute brisk walk or easy jog", sets: 1, rest: "-" },
          { name: "Full body stretching", duration: "10-15 min" }
        ]
      },
      {
        day: "Day 4 - Full Body Circuit",
        exercises: [
          { name: "Deadlifts", sets: 3, reps: "10", rest: "60s" },
          { name: "Dumbbell Lunges", sets: 3, reps: "12 each", rest: "45s" },
          { name: "Chest Press", sets: 3, reps: "12", rest: "45s" },
          { name: "Plank", sets: 3, duration: "45s", rest: "30s" },
          { name: "High Knees", sets: 3, duration: "30s", rest: "30s" },
          { name: "Battle Rope Slams", sets: 3, reps: "20", rest: "60s" }
        ]
      },
      {
        day: "Day 5 - LISS Cardio",
        exercises: [
          { name: "45 min steady-state cardio (treadmill/bike/elliptical)", sets: 1, rest: "-" }
        ]
      }
    ],
    notes: "Keep a 300-500 calorie deficit. Prioritize protein (2g/kg body weight). Stay hydrated."
  },
  {
    id: 2, goal: 'muscle_gain', name: "Push/Pull/Legs Hypertrophy",
    description: "Classic PPL split optimized for muscle hypertrophy. Each muscle group trained twice per week with progressive overload.",
    frequency: "6 days/week", difficulty: "Intermediate-Advanced", duration: "60-70 min/session",
    days: [
      {
        day: "Day 1 - Push (Chest, Shoulders, Triceps)",
        exercises: [
          { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "8-12", rest: "90s" },
          { name: "Overhead Barbell Press", sets: 3, reps: "8-10", rest: "2 min" },
          { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60s" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Tricep Dips", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Overhead Tricep Extension", sets: 3, reps: "12", rest: "60s" }
        ]
      },
      {
        day: "Day 2 - Pull (Back, Biceps, Rear Delts)",
        exercises: [
          { name: "Deadlifts", sets: 4, reps: "5", rest: "3 min" },
          { name: "Weighted Pull-ups", sets: 4, reps: "6-8", rest: "2-3 min" },
          { name: "Barbell Rows", sets: 3, reps: "8-10", rest: "2 min" },
          { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Face Pulls", sets: 3, reps: "15", rest: "60s" },
          { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Hammer Curls", sets: 3, reps: "12", rest: "60s" }
        ]
      },
      {
        day: "Day 3 - Legs (Quads, Hamstrings, Glutes, Calves)",
        exercises: [
          { name: "Barbell Back Squats", sets: 4, reps: "6-8", rest: "3 min" },
          { name: "Romanian Deadlifts", sets: 3, reps: "8-10", rest: "2 min" },
          { name: "Leg Press", sets: 3, reps: "12-15", rest: "90s" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10 each", rest: "90s" },
          { name: "Leg Curl Machine", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Standing Calf Raises", sets: 4, reps: "15-20", rest: "60s" }
        ]
      },
      {
        day: "Day 4 - Push (Volume Focus)", exercises: [
          { name: "Incline Barbell Press", sets: 4, reps: "8-10", rest: "2 min" },
          { name: "Machine Chest Press", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Front Raises", sets: 3, reps: "12", rest: "60s" },
          { name: "Pec Deck Flyes", sets: 3, reps: "15", rest: "60s" },
          { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60s" }
        ]
      },
      {
        day: "Day 5 - Pull (Volume Focus)", exercises: [
          { name: "Weighted Chin-ups", sets: 4, reps: "6-8", rest: "2-3 min" },
          { name: "Single-Arm DB Row", sets: 3, reps: "10 each", rest: "90s" },
          { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Cable Row", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Reverse Flyes", sets: 3, reps: "15", rest: "60s" },
          { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12", rest: "90s" },
          { name: "Spider Curls", sets: 3, reps: "12", rest: "60s" }
        ]
      },
      { day: "Day 6 - Legs (Posterior Focus)", exercises: [
          { name: "Sumo Deadlifts", sets: 4, reps: "5-6", rest: "3 min" },
          { name: "Hack Squats", sets: 3, reps: "10-12", rest: "2 min" },
          { name: "Hip Thrusts", sets: 4, reps: "10-12", rest: "90s" },
          { name: "Leg Extensions", sets: 3, reps: "15", rest: "60s" },
          { name: "Seated Leg Curls", sets: 3, reps: "12-15", rest: "60s" },
          { name: "Seated Calf Raises", sets: 4, reps: "15-20", rest: "60s" }
        ]
      },
      { day: "Day 7 - Rest & Recovery", exercises: [
          { name: "Full body stretching / Yoga", duration: "20-30 min" },
          { name: "Light walk", duration: "20 min" }
        ]
      }
    ],
    notes: "Eat in a 200-400 calorie surplus. Protein 2-2.5g/kg. Sleep 7-9 hours. Add weight when you complete all reps cleanly."
  },
  {
    id: 3, goal: 'maintenance', name: "3-Day Full Body Maintenance",
    description: "Time-efficient full body program that maintains strength and muscle with 3 training days. Perfect for busy schedules.",
    frequency: "3 days/week", difficulty: "Beginner-Intermediate", duration: "50-60 min/session",
    days: [
      {
        day: "Day 1 - Full Body A",
        exercises: [
          { name: "Barbell Squats", sets: 3, reps: "8-10", rest: "2 min" },
          { name: "Bench Press", sets: 3, reps: "8-10", rest: "2 min" },
          { name: "Bent-over Rows", sets: 3, reps: "10", rest: "90s" },
          { name: "Military Press", sets: 3, reps: "10", rest: "90s" },
          { name: "Romanian Deadlifts", sets: 3, reps: "10", rest: "90s" },
          { name: "Planks", sets: 3, duration: "30-60s", rest: "60s" }
        ]
      },
      {
        day: "Day 2 - Rest / Cardio",
        exercises: [{ name: "Optional: 30 min walk or light jog", sets: 1 }]
      },
      {
        day: "Day 3 - Full Body B",
        exercises: [
          { name: "Deadlifts", sets: 3, reps: "5-6", rest: "3 min" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10", rest: "90s" },
          { name: "Pull-ups or Lat Pulldown", sets: 3, reps: "8-10", rest: "90s" },
          { name: "Dumbbell Lunges", sets: 3, reps: "10 each", rest: "90s" },
          { name: "Face Pulls", sets: 3, reps: "15", rest: "60s" },
          { name: "Ab Wheel Rollouts", sets: 3, reps: "8-10", rest: "60s" }
        ]
      },
      {
        day: "Day 4 - Rest / Cardio",
        exercises: [{ name: "Optional: 20-30 min moderate cardio", sets: 1 }]
      },
      {
        day: "Day 5 - Full Body C",
        exercises: [
          { name: "Front Squats", sets: 3, reps: "8", rest: "2 min" },
          { name: "Push-ups (weighted)", sets: 3, reps: "12-15", rest: "90s" },
          { name: "Single-Arm Rows", sets: 3, reps: "10 each", rest: "90s" },
          { name: "Hip Thrusts", sets: 3, reps: "12", rest: "90s" },
          { name: "Lateral Raises", sets: 3, reps: "15", rest: "60s" },
          { name: "Cable Crunches", sets: 3, reps: "15", rest: "60s" }
        ]
      }
    ],
    notes: "Eat at maintenance calories. Prioritize sleep and stress management. Great for life balance."
  },
  {
    id: 4, goal: 'endurance', name: "Endurance & Athletic Performance",
    description: "Builds cardiovascular endurance, functional strength, and athletic durability. Combines running, functional strength, and mobility.",
    frequency: "5 days/week", difficulty: "Intermediate", duration: "45-75 min/session",
    days: [
      { day: "Day 1 - Long Run / Cardio Base", exercises: [
        { name: "Easy long run (60-75% max HR)", duration: "40-60 min" },
        { name: "Dynamic stretching", duration: "10 min" }
      ]},
      { day: "Day 2 - Functional Strength", exercises: [
        { name: "Kettlebell Swings", sets: 4, reps: "15", rest: "60s" },
        { name: "Box Jumps", sets: 4, reps: "8", rest: "60s" },
        { name: "Pull-ups", sets: 3, reps: "8-10", rest: "90s" },
        { name: "Goblet Squats", sets: 3, reps: "15", rest: "60s" },
        { name: "Farmer's Walk", sets: 4, duration: "30s", rest: "60s" }
      ]},
      { day: "Day 3 - Interval Training", exercises: [
        { name: "Warm-up jog", duration: "10 min easy" },
        { name: "400m intervals x 6 (90% effort)", sets: 6, rest: "2 min between" },
        { name: "Cool-down walk/jog", duration: "10 min" }
      ]},
      { day: "Day 4 - Recovery + Mobility", exercises: [
        { name: "Yoga or mobility routine", duration: "30-40 min" },
        { name: "Light swimming or cycling", duration: "20 min optional" }
      ]},
      { day: "Day 5 - Tempo Run + Core", exercises: [
        { name: "Tempo run (80-85% max HR)", duration: "25-35 min" },
        { name: "Planks", sets: 3, duration: "60s", rest: "30s" },
        { name: "Russian Twists", sets: 3, reps: "20", rest: "30s" },
        { name: "Hollow Body Hold", sets: 3, duration: "30s", rest: "30s" }
      ]}
    ],
    notes: "Fuel with adequate carbs for endurance training. Keep easy days truly easy. Focus on sleep for recovery."
  }
];

router.get('/', (req, res) => {
  const { goal } = req.query;
  if (goal) {
    const filtered = workoutSplits.filter(s => s.goal === goal);
    return res.json(filtered);
  }
  res.json(workoutSplits);
});

router.get('/:id', (req, res) => {
  const split = workoutSplits.find(s => s.id === parseInt(req.params.id));
  if (!split) return res.status(404).json({ message: 'Not found' });
  res.json(split);
});

module.exports = router;
