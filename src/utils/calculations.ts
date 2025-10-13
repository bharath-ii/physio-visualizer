// BMI Calculation
export const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Calorie estimation from diet description
export const estimateCaloriesFromDiet = (
  breakfast: string,
  lunch: string,
  dinner: string
): number => {
  // Simple estimation based on common Indian meals
  const mealCalories = (meal: string): number => {
    if (!meal || meal.trim() === "") return 0;
    
    const lowerMeal = meal.toLowerCase();
    let calories = 300; // Base calories for any meal
    
    // Common food items and their approximate calories
    if (lowerMeal.includes("egg")) calories += 70 * (lowerMeal.match(/egg/g)?.length || 1);
    if (lowerMeal.includes("toast") || lowerMeal.includes("bread")) calories += 80;
    if (lowerMeal.includes("milk")) calories += 100;
    if (lowerMeal.includes("rice")) calories += 200;
    if (lowerMeal.includes("roti") || lowerMeal.includes("chapati")) calories += 70 * 2;
    if (lowerMeal.includes("dal")) calories += 150;
    if (lowerMeal.includes("chicken")) calories += 200;
    if (lowerMeal.includes("paneer")) calories += 250;
    if (lowerMeal.includes("curry")) calories += 150;
    if (lowerMeal.includes("vegetable")) calories += 50;
    if (lowerMeal.includes("salad")) calories += 30;
    if (lowerMeal.includes("fruit")) calories += 60;
    if (lowerMeal.includes("juice")) calories += 100;
    
    return calories;
  };

  return mealCalories(breakfast) + mealCalories(lunch) + mealCalories(dinner);
};

// Calorie estimation from workout description
export const estimateCaloriesBurned = (
  morningWorkout: string,
  eveningWorkout: string,
  nightWorkout: string
): number => {
  const workoutCalories = (workout: string): number => {
    if (!workout || workout.trim() === "") return 0;
    
    const lowerWorkout = workout.toLowerCase();
    let calories = 0;
    
    // Extract duration if mentioned
    const durationMatch = workout.match(/(\d+)\s*(min|minute|hour|hr)/i);
    const duration = durationMatch ? parseInt(durationMatch[1]) : 30; // default 30 min
    const isHours = durationMatch?.[2].toLowerCase().includes('hour') || durationMatch?.[2].toLowerCase().includes('hr');
    const minutes = isHours ? duration * 60 : duration;
    
    // Calories per minute for different activities
    if (lowerWorkout.includes("running") || lowerWorkout.includes("jogging")) {
      calories = minutes * 10;
    } else if (lowerWorkout.includes("walking")) {
      calories = minutes * 4;
    } else if (lowerWorkout.includes("gym") || lowerWorkout.includes("weight")) {
      calories = minutes * 6;
    } else if (lowerWorkout.includes("yoga")) {
      calories = minutes * 3;
    } else if (lowerWorkout.includes("cycling")) {
      calories = minutes * 8;
    } else if (lowerWorkout.includes("swimming")) {
      calories = minutes * 11;
    } else if (lowerWorkout.includes("sports") || lowerWorkout.includes("football") || lowerWorkout.includes("cricket")) {
      calories = minutes * 7;
    } else {
      calories = minutes * 5; // Default moderate activity
    }
    
    return calories;
  };

  return workoutCalories(morningWorkout) + workoutCalories(eveningWorkout) + workoutCalories(nightWorkout);
};
