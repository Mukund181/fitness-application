const express = require('express');
const router = express.Router();

const recipes = [
  {
    id: 1, goal: ['fat_loss'], name: "High-Protein Grilled Chicken Salad",
    image: "🥗", prepTime: "15 min", cookTime: "20 min", servings: 2, difficulty: "Easy",
    calories: 320, protein: 42, carbs: 12, fat: 10,
    ingredients: ["200g chicken breast","2 cups mixed greens","1 cucumber","1 tomato","1/4 red onion","2 tbsp olive oil","1 lemon","salt, pepper, herbs"],
    instructions: ["Season chicken with salt, pepper, herbs.","Grill chicken 6-7 min per side.","Chop vegetables while chicken rests.","Slice chicken and toss with greens.","Dress with olive oil and lemon juice.","Season and serve immediately."],
    tags: ["high-protein","low-carb","quick"]
  },
  {
    id: 2, goal: ['muscle_gain'], name: "Muscle Builder Oatmeal Power Bowl",
    image: "🥣", prepTime: "5 min", cookTime: "10 min", servings: 1, difficulty: "Easy",
    calories: 620, protein: 35, carbs: 78, fat: 14,
    ingredients: ["100g oats","1 scoop whey protein","1 banana","30g almonds","1 tbsp peanut butter","250ml whole milk","1 tsp honey","cinnamon"],
    instructions: ["Cook oats with milk on medium heat.","Remove from heat and stir in protein powder.","Top with sliced banana and almonds.","Add peanut butter and drizzle honey.","Sprinkle cinnamon and serve warm."],
    tags: ["high-calorie","pre-workout","bulking"]
  },
  {
    id: 3, goal: ['fat_loss','maintenance'], name: "Salmon & Quinoa Buddha Bowl",
    image: "🐟", prepTime: "10 min", cookTime: "20 min", servings: 2, difficulty: "Medium",
    calories: 445, protein: 38, carbs: 35, fat: 16,
    ingredients: ["200g salmon fillet","150g quinoa","2 cups spinach","1 avocado","1 cup cherry tomatoes","2 tbsp tahini","1 lemon","garlic, herbs"],
    instructions: ["Cook quinoa in water (1:2 ratio) for 15 min.","Season salmon with garlic and herbs.","Pan-sear salmon 4 min each side.","Assemble bowl with quinoa base, spinach.","Top with salmon, avocado, tomatoes.","Drizzle with tahini-lemon dressing."],
    tags: ["omega-3","balanced","meal-prep"]
  },
  {
    id: 4, goal: ['muscle_gain'], name: "Post-Workout Protein Pancakes",
    image: "🥞", prepTime: "5 min", cookTime: "10 min", servings: 1, difficulty: "Easy",
    calories: 520, protein: 45, carbs: 52, fat: 12,
    ingredients: ["2 eggs", "1 banana","1 scoop whey protein","50g oats","1 tsp baking powder","1 tsp vanilla","coconut oil for cooking","berries for topping"],
    instructions: ["Blend all ingredients until smooth batter forms.","Heat coconut oil in non-stick pan.","Pour small circles of batter.","Cook 2-3 min until bubbles form, flip.","Cook 1-2 more minutes until golden.","Top with berries and serve."],
    tags: ["post-workout","high-protein","bulking"]
  },
  {
    id: 5, goal: ['fat_loss'], name: "Egg White Veggie Scramble",
    image: "🍳", prepTime: "5 min", cookTime: "8 min", servings: 1, difficulty: "Easy",
    calories: 185, protein: 28, carbs: 8, fat: 4,
    ingredients: ["5 egg whites","1/2 cup spinach","1/4 bell pepper","1/4 onion","1/2 tomato","1 tsp olive oil","salt, pepper, turmeric, paprika"],
    instructions: ["Whisk egg whites with seasoning.","Heat olive oil in pan over medium heat.","Sauté vegetables for 2-3 minutes.","Pour egg whites over vegetables.","Scramble gently until set.","Serve immediately."],
    tags: ["low-calorie","high-protein","quick"]
  },
  {
    id: 6, goal: ['muscle_gain','maintenance'], name: "Lentil Dal with Brown Rice",
    image: "🍛", prepTime: "10 min", cookTime: "30 min", servings: 3, difficulty: "Medium",
    calories: 390, protein: 22, carbs: 65, fat: 5,
    ingredients: ["200g red lentils","150g brown rice","1 onion","2 tomatoes","3 garlic cloves","1 tsp cumin","1 tsp turmeric","1 tsp garam masala","fresh coriander","salt"],
    instructions: ["Cook brown rice as per package directions.","Wash lentils and boil until soft (20 min).","Sauté onion and garlic until golden.","Add tomatoes and spices, cook 5 min.","Combine with lentils and simmer 10 min.","Serve over brown rice with coriander."],
    tags: ["plant-protein","high-fiber","budget-friendly"]
  },
  {
    id: 7, goal: ['fat_loss'], name: "Turkey Lettuce Wraps",
    image: "🌮", prepTime: "10 min", cookTime: "15 min", servings: 2, difficulty: "Easy",
    calories: 260, protein: 34, carbs: 10, fat: 8,
    ingredients: ["300g lean turkey mince","1 head lettuce","1 carrot (grated)","2 spring onions","2 garlic cloves","1 tbsp soy sauce","1 tsp ginger","sesame oil","lime"],
    instructions: ["Cook turkey mince in sesame oil until cooked.","Add garlic, ginger and cook 2 min.","Add soy sauce, carrot, spring onions.","Stir-fry for 3 more minutes.","Separate lettuce leaves as cups.","Fill lettuce cups with turkey mixture and lime."],
    tags: ["low-carb","high-protein","keto-friendly"]
  },
  {
    id: 8, goal: ['maintenance','endurance'], name: "Banana Peanut Butter Energy Smoothie",
    image: "🥤", prepTime: "5 min", cookTime: "0 min", servings: 1, difficulty: "Easy",
    calories: 480, protein: 25, carbs: 58, fat: 16,
    ingredients: ["2 bananas","2 tbsp peanut butter","1 scoop protein powder","250ml almond milk","1 tsp honey","ice cubes","cacao nibs (optional)"],
    instructions: ["Add all ingredients to blender.","Blend on high until smooth.","Add more milk for desired consistency.","Pour into glass over ice.","Top with cacao nibs if desired.","Consume within 30 minutes."],
    tags: ["pre-workout","energy","quick"]
  },
  {
    id: 9, goal: ['fat_loss','maintenance'], name: "Baked Herb Chicken with Roasted Veggies",
    image: "🍗", prepTime: "15 min", cookTime: "35 min", servings: 2, difficulty: "Medium",
    calories: 355, protein: 45, carbs: 20, fat: 9,
    ingredients: ["2 chicken thighs (skinless)","1 zucchini","1 bell pepper","1 cup cherry tomatoes","1 red onion","2 tbsp olive oil","rosemary, thyme, garlic","lemon zest, salt, pepper"],
    instructions: ["Preheat oven to 200°C (400°F).","Marinate chicken with herbs, lemon, garlic.","Chop vegetables and toss with olive oil.","Place chicken and veggies on baking sheet.","Bake 30-35 minutes until golden.","Rest 5 minutes before serving."],
    tags: ["meal-prep","low-carb","oven-baked"]
  },
  {
    id: 10, goal: ['muscle_gain'], name: "Cottage Cheese Berry Parfait",
    image: "🍓", prepTime: "5 min", cookTime: "0 min", servings: 1, difficulty: "Easy",
    calories: 320, protein: 30, carbs: 32, fat: 6,
    ingredients: ["250g low-fat cottage cheese","100g mixed berries","30g granola","1 tbsp honey","1 tsp vanilla extract","chia seeds"],
    instructions: ["Layer cottage cheese in a glass.","Top with half the berries.","Add granola layer.","Add remaining cottage cheese.","Top with remaining berries.","Drizzle honey and sprinkle chia seeds."],
    tags: ["high-protein","snack","no-cook"]
  }
];

router.get('/', (req, res) => {
  const { goal } = req.query;
  if (goal) {
    const filtered = recipes.filter(r => r.goal.includes(goal));
    return res.json(filtered);
  }
  res.json(recipes);
});

router.get('/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

module.exports = router;
