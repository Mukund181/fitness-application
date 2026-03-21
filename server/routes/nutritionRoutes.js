const express = require('express');
const router = express.Router();

const nutritionData = [
  { id: 1, name: "Chicken Breast (cooked)", category: "Protein", per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 }, vitamins: { B12: "0.3mcg", B6: "0.9mg", niacin: "14mg" }, minerals: { phosphorus: "220mg", selenium: "27mcg" } },
  { id: 2, name: "Brown Rice (cooked)", category: "Grains", per100g: { calories: 123, protein: 2.7, carbs: 25.6, fat: 0.97, fiber: 1.6, sugar: 0.4, sodium: 1 }, vitamins: { B1: "0.1mg", B3: "1.5mg" }, minerals: { magnesium: "44mg", phosphorus: "83mg" } },
  { id: 3, name: "Whole Egg", category: "Protein", per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 }, vitamins: { A: "160IU", D: "87IU", B12: "1.1mcg" }, minerals: { iron: "1.8mg", zinc: "1.3mg" } },
  { id: 4, name: "Oats (raw)", category: "Grains", per100g: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10.6, sugar: 0, sodium: 2 }, vitamins: { B1: "0.8mg", B5: "1.3mg" }, minerals: { magnesium: "177mg", iron: "5mg" } },
  { id: 5, name: "Greek Yogurt (plain)", category: "Dairy", per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36 }, vitamins: { B12: "0.75mcg", B2: "0.3mg" }, minerals: { calcium: "111mg", phosphorus: "135mg" } },
  { id: 6, name: "Almonds", category: "Nuts & Seeds", per100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, sugar: 4.4, sodium: 1 }, vitamins: { E: "25.6mg", B2: "1.1mg" }, minerals: { magnesium: "270mg", calcium: "264mg" } },
  { id: 7, name: "Sweet Potato (cooked)", category: "Vegetables", per100g: { calories: 90, protein: 2, carbs: 21, fat: 0.1, fiber: 3.3, sugar: 4.2, sodium: 36 }, vitamins: { A: "19218IU", C: "22.7mg", B6: "0.3mg" }, minerals: { potassium: "475mg", manganese: "0.3mg" } },
  { id: 8, name: "Broccoli (raw)", category: "Vegetables", per100g: { calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 }, vitamins: { C: "89mg", K: "102mcg", A: "623IU" }, minerals: { calcium: "47mg", iron: "0.7mg" } },
  { id: 9, name: "Banana", category: "Fruits", per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12.2, sodium: 1 }, vitamins: { B6: "0.4mg", C: "8.7mg" }, minerals: { potassium: "358mg", magnesium: "27mg" } },
  { id: 10, name: "Salmon (cooked)", category: "Protein", per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59 }, vitamins: { D: "526IU", B12: "3.2mcg", B3: "8.9mg" }, minerals: { selenium: "36mcg", phosphorus: "252mg" } },
  { id: 11, name: "Avocado", category: "Fruits", per100g: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, sodium: 7 }, vitamins: { K: "21mcg", E: "2.1mg", C: "10mg" }, minerals: { potassium: "485mg", magnesium: "29mg" } },
  { id: 12, name: "Quinoa (cooked)", category: "Grains", per100g: { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 }, vitamins: { B1: "0.1mg", B2: "0.1mg" }, minerals: { magnesium: "64mg", iron: "1.5mg" } },
  { id: 13, name: "Lentils (cooked)", category: "Legumes", per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9, sugar: 1.8, sodium: 2 }, vitamins: { B9: "181mcg", B1: "0.2mg" }, minerals: { iron: "3.3mg", potassium: "369mg" } },
  { id: 14, name: "Whole Milk", category: "Dairy", per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 43 }, vitamins: { A: "46mcg", D: "40IU", B12: "0.36mcg" }, minerals: { calcium: "113mg", potassium: "143mg" } },
  { id: 15, name: "Peanut Butter", category: "Nuts & Seeds", per100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, sodium: 459 }, vitamins: { E: "9mg", B3: "13.1mg" }, minerals: { magnesium: "168mg", phosphorus: "358mg" } },
  { id: 16, name: "White Rice (cooked)", category: "Grains", per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, sodium: 1 }, vitamins: { B1: "0.02mg", B3: "0.4mg" }, minerals: { iron: "0.2mg", magnesium: "12mg" } },
  { id: 17, name: "Spinach (raw)", category: "Vegetables", per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 }, vitamins: { K: "483mcg", A: "9377IU", C: "28mg" }, minerals: { iron: "2.7mg", calcium: "99mg" } },
  { id: 18, name: "Cottage Cheese", category: "Dairy", per100g: { calories: 98, protein: 11.1, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 2.7, sodium: 364 }, vitamins: { B12: "0.43mcg", B2: "0.2mg" }, minerals: { calcium: "83mg", phosphorus: "159mg" } },
  { id: 19, name: "Eggs (egg white)", category: "Protein", per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.5, sodium: 166 }, vitamins: { B2: "0.4mg" }, minerals: { potassium: "163mg", magnesium: "11mg" } },
  { id: 20, name: "Tuna (canned in water)", category: "Protein", per100g: { calories: 116, protein: 26, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 333 }, vitamins: { B12: "2.5mcg", D: "68IU", B3: "13.3mg" }, minerals: { selenium: "90mcg", phosphorus: "210mg" } },
  { id: 21, name: "Blueberries", category: "Fruits", per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1 }, vitamins: { C: "9.7mg", K: "19mcg", E: "0.6mg" }, minerals: { manganese: "0.3mg", potassium: "77mg" } },
  { id: 22, name: "Chickpeas (cooked)", category: "Legumes", per100g: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sugar: 4.8, sodium: 7 }, vitamins: { B9: "172mcg", B6: "0.14mg" }, minerals: { iron: "2.9mg", magnesium: "48mg" } },
  { id: 23, name: "Tofu (firm)", category: "Protein", per100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.7, sodium: 7 }, vitamins: { B1: "0.1mg" }, minerals: { calcium: "350mg", iron: "5.4mg" } },
  { id: 24, name: "Olive Oil", category: "Fats & Oils", per100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2 }, vitamins: { E: "14.4mg", K: "60mcg" }, minerals: {} },
  { id: 25, name: "Whey Protein (scoop)", category: "Supplements", per100g: { calories: 400, protein: 80, carbs: 8, fat: 5, fiber: 0, sugar: 5, sodium: 150 }, vitamins: {}, minerals: {} }
];

router.get('/', (req, res) => res.json(nutritionData));
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = nutritionData.filter(f => f.name.toLowerCase().includes(q));
  res.json(results);
});
router.get('/categories', (req, res) => {
  const cats = [...new Set(nutritionData.map(f => f.category))];
  res.json(cats);
});
router.get('/category/:cat', (req, res) => {
  const results = nutritionData.filter(f => f.category.toLowerCase() === req.params.cat.toLowerCase());
  res.json(results);
});
router.get('/:id', (req, res) => {
  const item = nutritionData.find(f => f.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

module.exports = router;
