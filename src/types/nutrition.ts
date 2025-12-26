export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  dailyCalorieGoal: number;
  createdAt: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  timestamp: string;
}

export interface DailyLog {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// Common food database with approximate nutrition per 100g
export const FOOD_DATABASE: Record<string, { calories: number; protein: number; carbs: number; fat: number; servingSize: number }> = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: 150 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: 150 },
  'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, servingSize: 150 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: 100 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, servingSize: 150 },
  
  // Carbs
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, servingSize: 200 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: 200 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, servingSize: 60 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: 200 },
  'oatmeal': { calories: 389, protein: 17, carbs: 66, fat: 7, servingSize: 80 },
  
  // Fruits & Vegetables
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: 120 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: 180 },
  'salad': { calories: 20, protein: 1.5, carbs: 3.5, fat: 0.2, servingSize: 100 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: 150 },
  
  // Dairy
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, servingSize: 250 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, servingSize: 30 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.7, servingSize: 150 },
  
  // Fast Food & Common Meals
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, servingSize: 200 },
  'burger': { calories: 295, protein: 17, carbs: 24, fat: 14, servingSize: 200 },
  'sandwich': { calories: 250, protein: 12, carbs: 30, fat: 9, servingSize: 180 },
  'noodles': { calories: 138, protein: 4.5, carbs: 25, fat: 2, servingSize: 250 },
  'soup': { calories: 75, protein: 4, carbs: 10, fat: 2, servingSize: 300 },
  'curry': { calories: 150, protein: 8, carbs: 12, fat: 8, servingSize: 250 },
  
  // Snacks
  'chips': { calories: 536, protein: 7, carbs: 53, fat: 35, servingSize: 50 },
  'chocolate': { calories: 546, protein: 5, carbs: 60, fat: 31, servingSize: 40 },
  'nuts': { calories: 607, protein: 20, carbs: 21, fat: 54, servingSize: 30 },
  'cookie': { calories: 488, protein: 5, carbs: 64, fat: 24, servingSize: 30 },
  
  // Drinks
  'juice': { calories: 45, protein: 0.7, carbs: 10, fat: 0.1, servingSize: 250 },
  'smoothie': { calories: 70, protein: 2, carbs: 15, fat: 0.5, servingSize: 300 },
  'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, servingSize: 250 },
  
  // Default for unknown foods
  'food': { calories: 200, protein: 10, carbs: 25, fat: 8, servingSize: 200 },
};

export function calculateDailyCalories(age: number, weight: number, height: number): number {
  // Using Mifflin-St Jeor Equation for BMR (assuming male for weight gain)
  // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  
  // TDEE with moderate activity multiplier (1.55)
  const tdee = bmr * 1.55;
  
  // Add 500 calories surplus for weight gain
  return Math.round(tdee + 500);
}

export function matchFoodFromLabel(label: string): string {
  const lowerLabel = label.toLowerCase();
  
  // Check for exact matches or partial matches
  for (const food of Object.keys(FOOD_DATABASE)) {
    if (lowerLabel.includes(food) || food.includes(lowerLabel)) {
      return food;
    }
  }
  
  // Common food mappings from image classification labels
  const mappings: Record<string, string> = {
    'meat': 'beef',
    'steak': 'beef',
    'pork': 'beef',
    'poultry': 'chicken',
    'seafood': 'fish',
    'salmon': 'fish',
    'tuna': 'fish',
    'spaghetti': 'pasta',
    'noodle': 'noodles',
    'ramen': 'noodles',
    'fries': 'potato',
    'french fries': 'potato',
    'cereal': 'oatmeal',
    'pancake': 'bread',
    'waffle': 'bread',
    'cake': 'cookie',
    'dessert': 'chocolate',
    'ice cream': 'chocolate',
    'soda': 'juice',
    'beverage': 'juice',
    'vegetable': 'salad',
    'fruit': 'apple',
  };
  
  for (const [key, value] of Object.entries(mappings)) {
    if (lowerLabel.includes(key)) {
      return value;
    }
  }
  
  return 'food'; // Default fallback
}
