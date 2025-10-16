import { FoodItem } from "@/components/FoodInput";
import { calculateFoodCalories } from "./foodDatabase";

// BMI Calculation
export const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

// Calculate total calories from food items
export const calculateMealCalories = (foods: FoodItem[]): number => {
  return foods.reduce((total, food) => {
    return total + calculateFoodCalories(food.name, food.quantity, food.unit);
  }, 0);
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
