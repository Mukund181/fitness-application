const express = require('express');
const router = express.Router();

const myths = [
  {
    id: 1, category: "Training", myth: "Lifting weights will make women bulky",
    verdict: "FALSE", emoji: "🏋️",
    truth: "Women have 15-20x less testosterone than men, making it physiologically very difficult to build large muscle mass. Strength training instead creates lean, toned physiques, increases metabolism, and improves bone density.",
    science: "Testosterone is the primary anabolic hormone responsible for significant muscle hypertrophy. Without pharmacological assistance, women simply cannot develop the muscle mass seen in male bodybuilders.",
    actionTip: "Women should strength train 3-4x per week. It's one of the best tools for body composition improvement and long-term health."
  },
  {
    id: 2, category: "Nutrition", myth: "Carbs make you fat",
    verdict: "FALSE", emoji: "🍞",
    truth: "No single macronutrient causes fat gain. Fat is stored when you consume MORE calories than you burn (calorie surplus), regardless of whether those calories come from carbs, fat, or protein.",
    science: "De novo lipogenesis (converting carbs to fat) requires significant overconsumption of carbohydrates. Moderate carbohydrate consumption fuels training, preserves muscle, and supports performance.",
    actionTip: "Focus on total calorie balance and quality of carbs. Whole grains, fruits, and vegetables are associated with better body composition outcomes."
  },
  {
    id: 3, category: "Training", myth: "You need to feel sore to have had a good workout (DOMS = progress)",
    verdict: "FALSE", emoji: "😣",
    truth: "DOMS (Delayed Onset Muscle Soreness) is caused by eccentric stress and metabolic byproducts — not necessarily an indicator of muscle growth. Elite athletes often feel minimal soreness yet make consistent progress.",
    science: "Progressive overload (gradually increasing load, volume, or intensity) is the primary driver of muscle adaptation. Many top athletes train without significant soreness due to adaptation.",
    actionTip: "Track your progressive overload. Judge workouts by performance improvements, not by soreness levels."
  },
  {
    id: 4, category: "Nutrition", myth: "Eating after 8 PM causes fat gain",
    verdict: "FALSE", emoji: "🌙",
    truth: "Your body doesn't have a switch at 8 PM. Total daily calorie intake determines body composition, not the time of eating. Your metabolism continues 24/7. Research shows late eating may be associated with poor choices but isn't inherently fattening.",
    science: "Circadian rhythm research does show slight metabolic variations, but the effect is far smaller than total calorie balance. The issue is usually that late-night eaters tend to consume extra calories overall.",
    actionTip: "Focus on your total daily intake. If you prefer eating later, ensure it fits within your calorie goals."
  },
  {
    id: 5, category: "Supplements", myth: "You must take protein within 30 minutes post-workout (the 'anabolic window')",
    verdict: "PARTIALLY FALSE", emoji: "⏰",
    truth: "The anabolic window is much wider than originally believed — 2+ hours post-workout. If you ate a pre-workout meal, priority is less urgent. However, getting adequate daily protein (1.6-2.2g/kg) is what truly matters for muscle growth.",
    science: "Meta-analyses show that total daily protein intake is far more important than any specific timing window. The 30-minute window myth came from studies on fasted training.",
    actionTip: "Prioritize hitting your daily protein target (1.6-2.2g/kg body weight). Post-workout protein timing is a minor optimization."
  },
  {
    id: 6, category: "Training", myth: "Spot reduction works — do crunches to lose belly fat",
    verdict: "FALSE", emoji: "🎯",
    truth: "You cannot choose where your body burns fat. Fat loss occurs systemically through calorie deficit. Doing 1000 crunches won't burn belly fat specifically — it will strengthen abdominal muscles hidden under the fat.",
    science: "Fat mobilization is governed by hormones and genetics, not by which muscles you exercise. Multiple studies have definitively shown spot reduction is a myth.",
    actionTip: "Create a calorie deficit through diet and full-body training for fat loss. Core exercises build the muscles that will show as you lose body fat overall."
  },
  {
    id: 7, category: "Nutrition", myth: "More protein = more muscle (the more the better)",
    verdict: "FALSE", emoji: "🥩",
    truth: "There is a ceiling to how much protein your body can use for muscle building. Above 2.2g/kg of bodyweight, additional protein is simply oxidized for energy (calories) — not additional muscle. More protein beyond this threshold provides no extra anabolic benefit.",
    science: "Research consistently shows 1.6-2.2g/kg is sufficient for maximum muscle protein synthesis. Very high intakes (3g/kg+) show no additional muscle-building benefit in natural athletes.",
    actionTip: "Aim for 1.6-2.2g of protein per kg of bodyweight. Distribute across 4-5 meals for optimal use."
  },
  {
    id: 8, category: "Training", myth: "Cardio kills muscle gains",
    verdict: "PARTIALLY FALSE", emoji: "🏃",
    truth: "Excessive cardio combined with a calorie deficit can impair muscle growth. However, moderate cardio (2-3x/week) alongside adequate protein intake and calories is not muscle-destructive and actually improves cardiovascular health and recovery.",
    science: "The 'interference effect' is real at extreme volumes. But moderate aerobic training can actually improve mitochondrial density in muscle cells, aiding recovery.",
    actionTip: "Separate intense cardio and leg training by 6-8 hours. Keep cardio moderate and ensure calorie surplus/maintenance if focused on gaining muscle."
  },
  {
    id: 9, category: "General", myth: "Natural foods are always better than supplements",
    verdict: "NUANCED", emoji: "🌿",
    truth: "Whole foods are generally preferred for overall health due to micronutrients, fiber, and synergistic effects. However, some supplements (creatine, Vitamin D, omega-3) are backed by strong evidence and are difficult to obtain in optimal amounts through food alone.",
    science: "Supplements fill specific gaps. For example, most people don't eat enough fatty fish for optimal EPA/DHA, and creatine from food alone (300-500mg from meat) is well below the 3-5g therapeutic dose.",
    actionTip: "Build a strong dietary foundation first. Then use evidence-based supplements (creatine, Vitamin D, omega-3, protein if needed) to bridge specific gaps."
  },
  {
    id: 10, category: "General", myth: "Detox diets and cleanses remove toxins",
    verdict: "FALSE", emoji: "🧪",
    truth: "Your liver, kidneys, and lymphatic system are incredibly effective at filtering toxins 24/7. No diet product or juice cleanse has been proven to 'detox' the body beyond what these organs already do naturally.",
    science: "The term 'detox' used in marketing is deliberately vague. No credible scientific evidence supports detox diets removing named toxins. Studies on juice cleanses show no additional health markers improvement.",
    actionTip: "Support your natural detox organs: drink adequate water, eat fiber-rich foods, minimize alcohol, get quality sleep, and exercise regularly."
  },
  {
    id: 11, category: "Training", myth: "You need to train 6-7 days per week for best results",
    verdict: "FALSE", emoji: "📅",
    truth: "Research shows 3-4 days of well-structured resistance training is optimal for most natural athletes. Recovery is when muscles grow — constant training without adequate recovery leads to overtraining syndrome, not faster gains.",
    science: "Supercompensation theory: muscles adapt and become stronger during recovery periods. Training too frequently before full recovery prevents full adaptation. Elite athletes need more volume, but 3-4x is optimal for most.",
    actionTip: "Train 3-4x per week with proper progressive overload. Focus on sleep quality (7-9 hours) and nutrition for recovery."
  },
  {
    id: 12, category: "Nutrition", myth: "Fat-free foods are healthier and better for weight loss",
    verdict: "FALSE", emoji: "🚫",
    truth: "Removing fat from foods means adding sugar, starch, and thickeners to maintain palatability and texture. Fat-free products often have similar or higher calories, spike blood sugar faster, and are less satiating than their full-fat counterparts.",
    science: "Dietary fat is essential for fat-soluble vitamin absorption (A, D, E, K), hormone production, and satiety. The low-fat diet craze coincided with skyrocketing obesity rates as people consumed more refined carbohydrates.",
    actionTip: "Choose whole food sources of healthy fats. Read labels on 'fat-free' products — often more processed with added sugars."
  }
];

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = myths.filter(m => m.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(myths);
});

router.get('/categories', (req, res) => {
  const cats = [...new Set(myths.map(m => m.category))];
  res.json(cats);
});

router.get('/:id', (req, res) => {
  const myth = myths.find(m => m.id === parseInt(req.params.id));
  if (!myth) return res.status(404).json({ message: 'Not found' });
  res.json(myth);
});

module.exports = router;
