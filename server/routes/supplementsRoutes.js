const express = require('express');
const router = express.Router();

const supplements = [
  {
    id: 1, name: "Whey Protein", category: "Protein",
    rating: 5, evidence: "Strong",
    emoji: "🥛",
    description: "A fast-digesting complete protein derived from milk. Contains all essential amino acids. Ideal for post-workout muscle repair and growth.",
    benefits: ["Promotes muscle protein synthesis","Fast absorption post-workout","Supports fat loss when used to hit protein goals","Improves recovery speed"],
    dosage: "20-40g per serving, 1-2 times daily. Best consumed within 30-60 min after training.",
    timing: "Post-workout",
    sideEffects: ["Digestive discomfort if lactose intolerant","Excess calories if overconsumed"],
    authenticity: ["Look for NSF Certified or Informed Sport certified brands","Check for third-party lab testing","Avoid proprietary blends","Reputable brands: Optimum Nutrition Gold Standard, MyProtein, Dymatize"],
    warning: "Not needed if you hit protein goals through food alone."
  },
  {
    id: 2, name: "Creatine Monohydrate", category: "Performance",
    rating: 5, evidence: "Very Strong",
    emoji: "⚡",
    description: "The most researched supplement in sports nutrition. Increases phosphocreatine stores in muscles, leading to improved high-intensity performance.",
    benefits: ["Increases strength and power output","Improves high-intensity exercise performance","Supports muscle growth","May improve cognitive function","Safe for long-term use"],
    dosage: "3-5g daily. No loading phase required. Take at any time of day — consistency is key.",
    timing: "Any time (post-workout for slight edge)",
    sideEffects: ["Water retention initially (intracellular - beneficial)","Rare GI upset if taken on empty stomach"],
    authenticity: ["Only buy Creatine Monohydrate (not ethyl ester or hydrochloride — no proven benefits)","Creapure® is the gold standard (Made in Germany)","Reputable brands: Optimum Nutrition, BulkSupplements, NOW Sports"],
    warning: "Ensure adequate hydration (3L+ water/day). Not recommended for kidney disease patients."
  },
  {
    id: 3, name: "Caffeine", category: "Performance",
    rating: 4, evidence: "Strong",
    emoji: "☕",
    description: "A natural stimulant found in coffee, tea, and pre-workouts. One of the most effective ergogenic aids for both endurance and strength performance.",
    benefits: ["Increases focus and alertness","Improves endurance performance","Enhances strength and power output","Boosts fat oxidation during exercise"],
    dosage: "3-6mg per kg of bodyweight. 150-300mg typical. Take 45-60 min pre-workout.",
    timing: "Pre-workout (30-60 min before)",
    sideEffects: ["Anxiety and jitteriness at high doses","Sleep disruption if taken late","Tolerance develops quickly","Withdrawal headaches"],
    authenticity: ["Coffee is a perfectly valid source","If using supplements, look for pure caffeine anhydrous","Avoid proprietary blends in pre-workouts","Cycle off for 1-2 weeks monthly to reset tolerance"],
    warning: "Avoid taking after 2 PM to protect sleep quality. Max 400mg/day (general population)."
  },
  {
    id: 4, name: "Vitamin D3", category: "Vitamins",
    rating: 4, evidence: "Strong",
    emoji: "☀️",
    description: "A fat-soluble vitamin critical for bone health, immune function, and hormone production including testosterone. Deficiency is extremely common.",
    benefits: ["Supports bone density","Improves immune function","May enhance testosterone levels","Reduces inflammation","Supports mood and mental health"],
    dosage: "1000-4000 IU daily with a fatty meal (D3 form only). Get blood levels checked first.",
    timing: "With meals (fat-soluble)",
    sideEffects: ["Toxicity at very high doses (>10,000 IU long-term)","Rare without extreme overconsumption"],
    authenticity: ["Always choose D3 (cholecalciferol) not D2","Combine with K2 (MK-7) for better calcium direction","Reputable brands: Thorne, NOW Foods, Sports Research"],
    warning: "Get bloodwork (25-OH-D) before supplementing. Toxicity is possible at very high doses."
  },
  {
    id: 5, name: "Omega-3 (Fish Oil)", category: "General Health",
    rating: 4, evidence: "Strong",
    emoji: "🐟",
    description: "Essential fatty acids EPA and DHA that the body cannot produce. Critical for heart, brain, joint health, and reducing inflammation from training.",
    benefits: ["Reduces exercise-induced inflammation","Supports cardiovascular health","Improves joint health","May enhance muscle protein synthesis","Supports brain function"],
    dosage: "2-3g of combined EPA+DHA daily. Take with meals.",
    timing: "With meals",
    sideEffects: ["Fishy burps (take with meals or choose enteric-coated)","Blood thinning at very high doses"],
    authenticity: ["Check EPA+DHA content (not just 'fish oil' amount)","Look for IFOS 5-star certified products","Reputable brands: Nordic Naturals, Carlson, Thorne"],
    warning: "Consult doctor if on blood thinners. Store in fridge to prevent oxidation."
  },
  {
    id: 6, name: "Magnesium Glycinate", category: "Minerals",
    rating: 4, evidence: "Moderate-Strong",
    emoji: "🧬",
    description: "The most bioavailable form of magnesium. Involved in 300+ enzymatic reactions, muscle function, sleep quality, and recovery.",
    benefits: ["Improves sleep quality","Reduces muscle cramps and soreness","Supports energy production","May improve insulin sensitivity","Reduces anxiety"],
    dosage: "300-400mg elemental magnesium before bed. Glycinate form is best absorbed.",
    timing: "Before sleep",
    sideEffects: ["Loose stools at high doses (less common with glycinate)","Generally very safe"],
    authenticity: ["Choose glycinate or malate form (not oxide — very poor absorption)","Reputable brands: NOW Foods, Thorne, Doctor's Best"],
    warning: "Avoid magnesium oxide (very poorly absorbed). Most commercial supplements use oxide — check labels."
  },
  {
    id: 7, name: "Beta-Alanine", category: "Performance",
    rating: 3, evidence: "Moderate",
    emoji: "🔥",
    description: "A non-essential amino acid that buffers lactic acid in muscles, delaying muscular fatigue during high-intensity exercise lasting 1-4 minutes.",
    benefits: ["Delays muscle fatigue in high-rep/high-intensity work","Improves performance in 1-4 minute duration efforts","Useful for HIIT, crossfit, and combat sports"],
    dosage: "3.2-6.4g daily. Best split into doses of 1-1.5g to minimize tingling.",
    timing: "Pre-workout or throughout the day",
    sideEffects: ["Paresthesia (intense tingling/flushing) — harmless","GI discomfort with large doses"],
    authenticity: ["Look for CarnoSyn® brand (clinically studied form)","Less useful for pure powerlifting or strength training"],
    warning: "The tingling is normal and harmless, but can be uncomfortable. Split doses help."
  },
  {
    id: 8, name: "Zinc", category: "Minerals",
    rating: 3, evidence: "Moderate",
    emoji: "⚙️",
    description: "An essential mineral involved in testosterone production, immune function, protein synthesis, and wound healing. Deficiency is common in athletes who sweat heavily.",
    benefits: ["Supports testosterone production","Enhances immune function","Aids protein synthesis and muscle recovery","Supports wound healing"],
    dosage: "15-30mg elemental zinc daily. Zinc picolinate or bisglycinate are best absorbed.",
    timing: "With meals (avoid with calcium supplements)",
    sideEffects: ["Nausea on empty stomach","Copper depletion at high doses (>40mg long-term)"],
    authenticity: ["Choose picolinate, bisglycinate, or citrate forms — not oxide","Reputable brands: Thorne, NOW Foods, Garden of Life"],
    warning: "Long-term high dosing can cause copper deficiency. Pair with copper if using >40mg."
  }
];

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = supplements.filter(s => s.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(supplements);
});

router.get('/categories', (req, res) => {
  const cats = [...new Set(supplements.map(s => s.category))];
  res.json(cats);
});

router.get('/:id', (req, res) => {
  const sup = supplements.find(s => s.id === parseInt(req.params.id));
  if (!sup) return res.status(404).json({ message: 'Not found' });
  res.json(sup);
});

module.exports = router;
