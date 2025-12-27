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
  // Indian Foods
  'dal': { calories: 116, protein: 9, carbs: 20, fat: 1, servingSize: 150 },
  'dal tadka': { calories: 150, protein: 9, carbs: 20, fat: 5, servingSize: 150 },
  'dal makhani': { calories: 200, protein: 9, carbs: 18, fat: 10, servingSize: 150 },
  'rajma': { calories: 140, protein: 9, carbs: 23, fat: 2, servingSize: 150 },
  'chole': { calories: 180, protein: 10, carbs: 27, fat: 4, servingSize: 150 },
  'chana masala': { calories: 180, protein: 10, carbs: 27, fat: 4, servingSize: 150 },
  'paneer': { calories: 265, protein: 18, carbs: 4, fat: 20, servingSize: 100 },
  'palak paneer': { calories: 220, protein: 12, carbs: 8, fat: 16, servingSize: 150 },
  'shahi paneer': { calories: 280, protein: 12, carbs: 10, fat: 22, servingSize: 150 },
  'paneer butter masala': { calories: 300, protein: 12, carbs: 12, fat: 24, servingSize: 150 },
  'butter chicken': { calories: 250, protein: 20, carbs: 8, fat: 16, servingSize: 150 },
  'chicken tikka masala': { calories: 230, protein: 22, carbs: 10, fat: 12, servingSize: 150 },
  'tandoori chicken': { calories: 180, protein: 25, carbs: 5, fat: 7, servingSize: 150 },
  'chicken biryani': { calories: 350, protein: 18, carbs: 45, fat: 12, servingSize: 250 },
  'veg biryani': { calories: 280, protein: 8, carbs: 48, fat: 8, servingSize: 250 },
  'biryani': { calories: 320, protein: 15, carbs: 45, fat: 10, servingSize: 250 },
  'pulao': { calories: 220, protein: 5, carbs: 40, fat: 5, servingSize: 200 },
  'jeera rice': { calories: 180, protein: 4, carbs: 38, fat: 2, servingSize: 200 },
  'roti': { calories: 71, protein: 3, carbs: 15, fat: 0.4, servingSize: 30 },
  'chapati': { calories: 71, protein: 3, carbs: 15, fat: 0.4, servingSize: 30 },
  'naan': { calories: 262, protein: 9, carbs: 45, fat: 5, servingSize: 90 },
  'paratha': { calories: 180, protein: 4, carbs: 25, fat: 7, servingSize: 60 },
  'aloo paratha': { calories: 220, protein: 5, carbs: 30, fat: 9, servingSize: 80 },
  'puri': { calories: 150, protein: 3, carbs: 18, fat: 8, servingSize: 40 },
  'bhatura': { calories: 280, protein: 6, carbs: 35, fat: 14, servingSize: 80 },
  'chole bhature': { calories: 450, protein: 15, carbs: 55, fat: 18, servingSize: 200 },
  'samosa': { calories: 260, protein: 5, carbs: 30, fat: 14, servingSize: 80 },
  'pakora': { calories: 180, protein: 5, carbs: 18, fat: 10, servingSize: 60 },
  'bhaji': { calories: 150, protein: 3, carbs: 15, fat: 9, servingSize: 60 },
  'pav bhaji': { calories: 380, protein: 10, carbs: 50, fat: 16, servingSize: 200 },
  'vada pav': { calories: 290, protein: 6, carbs: 35, fat: 14, servingSize: 120 },
  'idli': { calories: 39, protein: 2, carbs: 8, fat: 0.2, servingSize: 40 },
  'dosa': { calories: 120, protein: 3, carbs: 18, fat: 4, servingSize: 80 },
  'masala dosa': { calories: 200, protein: 5, carbs: 28, fat: 8, servingSize: 120 },
  'uttapam': { calories: 150, protein: 4, carbs: 22, fat: 5, servingSize: 100 },
  'upma': { calories: 180, protein: 5, carbs: 30, fat: 5, servingSize: 150 },
  'poha': { calories: 160, protein: 4, carbs: 28, fat: 4, servingSize: 150 },
  'khichdi': { calories: 200, protein: 7, carbs: 35, fat: 4, servingSize: 200 },
  'raita': { calories: 60, protein: 3, carbs: 5, fat: 3, servingSize: 100 },
  'lassi': { calories: 150, protein: 5, carbs: 20, fat: 5, servingSize: 200 },
  'mango lassi': { calories: 180, protein: 5, carbs: 28, fat: 5, servingSize: 200 },
  'chai': { calories: 80, protein: 2, carbs: 12, fat: 2, servingSize: 150 },
  'masala chai': { calories: 80, protein: 2, carbs: 12, fat: 2, servingSize: 150 },
  'gulab jamun': { calories: 150, protein: 2, carbs: 22, fat: 6, servingSize: 50 },
  'jalebi': { calories: 150, protein: 1, carbs: 30, fat: 4, servingSize: 50 },
  'kheer': { calories: 180, protein: 5, carbs: 28, fat: 6, servingSize: 150 },
  'halwa': { calories: 200, protein: 3, carbs: 30, fat: 8, servingSize: 80 },
  'ladoo': { calories: 180, protein: 4, carbs: 25, fat: 8, servingSize: 50 },
  'barfi': { calories: 160, protein: 4, carbs: 22, fat: 7, servingSize: 50 },
  'aloo gobi': { calories: 120, protein: 3, carbs: 15, fat: 6, servingSize: 150 },
  'baingan bharta': { calories: 130, protein: 3, carbs: 12, fat: 8, servingSize: 150 },
  'bhindi masala': { calories: 100, protein: 3, carbs: 10, fat: 6, servingSize: 150 },
  'malai kofta': { calories: 300, protein: 10, carbs: 20, fat: 22, servingSize: 150 },
  'korma': { calories: 280, protein: 15, carbs: 12, fat: 20, servingSize: 150 },
  'tikka': { calories: 200, protein: 22, carbs: 6, fat: 10, servingSize: 150 },
  'kebab': { calories: 220, protein: 18, carbs: 8, fat: 14, servingSize: 100 },
  'seekh kebab': { calories: 250, protein: 20, carbs: 5, fat: 18, servingSize: 100 },
  'fish curry': { calories: 200, protein: 20, carbs: 8, fat: 10, servingSize: 150 },
  'prawn curry': { calories: 180, protein: 18, carbs: 6, fat: 10, servingSize: 150 },
  'mutton curry': { calories: 280, protein: 22, carbs: 8, fat: 18, servingSize: 150 },
  'egg curry': { calories: 200, protein: 14, carbs: 8, fat: 13, servingSize: 150 },
  'thali': { calories: 800, protein: 25, carbs: 100, fat: 30, servingSize: 400 },
  
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
  
  // Check for exact matches first
  if (FOOD_DATABASE[lowerLabel]) {
    return lowerLabel;
  }
  
  // Check for partial matches in database
  for (const food of Object.keys(FOOD_DATABASE)) {
    if (lowerLabel.includes(food) || food.includes(lowerLabel)) {
      return food;
    }
  }
  
  // Indian food mappings from image classification labels
  const indianMappings: Record<string, string> = {
    // Curries and gravies
    'curry': 'dal',
    'gravy': 'dal',
    'stew': 'dal',
    'lentil': 'dal',
    'bean': 'rajma',
    'chickpea': 'chole',
    'hummus': 'chole',
    
    // Breads
    'flatbread': 'roti',
    'tortilla': 'roti',
    'pita': 'naan',
    'fried bread': 'puri',
    'stuffed bread': 'paratha',
    
    // Rice dishes
    'fried rice': 'biryani',
    'rice dish': 'pulao',
    'rice bowl': 'biryani',
    'pilaf': 'pulao',
    
    // Snacks
    'fritter': 'pakora',
    'dumpling': 'samosa',
    'pastry': 'samosa',
    'fried snack': 'pakora',
    
    // South Indian
    'crepe': 'dosa',
    'pancake': 'dosa',
    'steamed cake': 'idli',
    'rice cake': 'idli',
    
    // Drinks
    'tea': 'chai',
    'milkshake': 'lassi',
    'yogurt drink': 'lassi',
    
    // Desserts
    'dessert': 'kheer',
    'pudding': 'kheer',
    'sweet ball': 'gulab jamun',
    'candy': 'ladoo',
    'donut': 'jalebi',
    'fudge': 'barfi',
    
    // Proteins
    'grilled meat': 'tikka',
    'skewer': 'kebab',
    'roasted chicken': 'tandoori chicken',
    'cottage cheese': 'paneer',
    'cheese cube': 'paneer',
    
    // Vegetables
    'cauliflower': 'aloo gobi',
    'eggplant': 'baingan bharta',
    'okra': 'bhindi masala',
    'spinach dish': 'palak paneer',
  };
  
  for (const [key, value] of Object.entries(indianMappings)) {
    if (lowerLabel.includes(key)) {
      return value;
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
    'cake': 'cookie',
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
