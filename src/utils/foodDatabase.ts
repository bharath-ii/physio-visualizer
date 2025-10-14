// Calorie database for common Indian foods (per 100g or per piece)
export const foodCalories: Record<string, { calories: number; unit: "g" | "piece" }> = {
  // Grains and Staples
  rice: { calories: 130, unit: "g" },
  "brown rice": { calories: 112, unit: "g" },
  dosa: { calories: 120, unit: "piece" },
  idli: { calories: 39, unit: "piece" },
  roti: { calories: 71, unit: "piece" },
  chapati: { calories: 71, unit: "piece" },
  paratha: { calories: 126, unit: "piece" },
  naan: { calories: 262, unit: "piece" },
  poha: { calories: 158, unit: "g" },
  upma: { calories: 95, unit: "g" },
  
  // Dairy
  milk: { calories: 42, unit: "g" },
  curd: { calories: 60, unit: "g" },
  yogurt: { calories: 60, unit: "g" },
  paneer: { calories: 265, unit: "g" },
  ghee: { calories: 900, unit: "g" },
  butter: { calories: 717, unit: "g" },
  
  // Lentils and Legumes
  dal: { calories: 116, unit: "g" },
  "moong dal": { calories: 105, unit: "g" },
  "toor dal": { calories: 335, unit: "g" },
  "masoor dal": { calories: 116, unit: "g" },
  rajma: { calories: 127, unit: "g" },
  chana: { calories: 164, unit: "g" },
  
  // Vegetables
  potato: { calories: 77, unit: "g" },
  "mixed vegetables": { calories: 65, unit: "g" },
  spinach: { calories: 23, unit: "g" },
  tomato: { calories: 18, unit: "g" },
  onion: { calories: 40, unit: "g" },
  carrot: { calories: 41, unit: "g" },
  
  // Proteins
  chicken: { calories: 239, unit: "g" },
  fish: { calories: 206, unit: "g" },
  egg: { calories: 155, unit: "piece" },
  mutton: { calories: 294, unit: "g" },
  
  // Snacks
  samosa: { calories: 252, unit: "piece" },
  pakora: { calories: 180, unit: "piece" },
  vada: { calories: 185, unit: "piece" },
  
  // Fruits
  banana: { calories: 89, unit: "piece" },
  apple: { calories: 52, unit: "piece" },
  mango: { calories: 60, unit: "g" },
  orange: { calories: 47, unit: "piece" },
};

export const calculateFoodCalories = (foodItem: string, quantity: number): number => {
  const food = foodCalories[foodItem.toLowerCase()];
  if (!food) return 0;
  
  if (food.unit === "g") {
    // For gram-based items, quantity is in grams
    return (food.calories * quantity) / 100;
  } else {
    // For piece-based items, quantity is count
    return food.calories * quantity;
  }
};
