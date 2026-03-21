// Fitness calculations utility
export const calculateBMI = (weight, height) => {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#60a5fa' };
  if (bmi < 25) return { label: 'Normal', color: '#34d399' };
  if (bmi < 30) return { label: 'Overweight', color: '#fbbf24' };
  return { label: 'Obese', color: '#f87171' };
};

export const formatDate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatDate(d);
};

export const formatDisplayDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const getGoalLabel = (goal) => {
  const labels = {
    fat_loss: '🔥 Fat Loss',
    muscle_gain: '💪 Muscle Gain',
    maintenance: '⚖️ Maintenance',
    endurance: '🏃 Endurance'
  };
  return labels[goal] || goal;
};

export const getActivityLabel = (level) => {
  const labels = {
    sedentary: 'Sedentary (desk job)',
    light: 'Light (1-3 days/week)',
    moderate: 'Moderate (3-5 days/week)',
    active: 'Active (6-7 days/week)',
    very_active: 'Very Active (2x/day)'
  };
  return labels[level] || level;
};

export const getMacroPercentage = (macro, calories) => {
  const cal = macro === 'fat' ? macro * 9 : macro * 4;
  return Math.round((cal / calories) * 100);
};

export const caloriesBurnedLabel = (n) => `${Math.round(n)} kcal`;
