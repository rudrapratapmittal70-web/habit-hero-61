import { useState, useEffect } from 'react';
import { UserProfile, Meal, DailyLog, calculateDailyCalories } from '@/types/nutrition';

const PROFILE_KEY = 'nutrition_profile';
const MEALS_KEY = 'nutrition_meals';

export function useNutrition() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem(MEALS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Save meals to localStorage
  useEffect(() => {
    localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  }, [meals]);

  const setupProfile = (age: number, weight: number, height: number) => {
    const dailyCalorieGoal = calculateDailyCalories(age, weight, height);
    const newProfile: UserProfile = {
      age,
      weight,
      height,
      dailyCalorieGoal,
      createdAt: new Date().toISOString(),
    };
    setProfile(newProfile);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      if (updates.age || updates.weight || updates.height) {
        updatedProfile.dailyCalorieGoal = calculateDailyCalories(
          updates.age ?? profile.age,
          updates.weight ?? profile.weight,
          updates.height ?? profile.height
        );
      }
      setProfile(updatedProfile);
    }
  };

  const addMeal = (meal: Omit<Meal, 'id' | 'timestamp'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const removeMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
  };

  const getTodaysMeals = (): Meal[] => {
    const today = new Date().toDateString();
    return meals.filter(m => new Date(m.timestamp).toDateString() === today);
  };

  const getTodaysNutrition = () => {
    const todaysMeals = getTodaysMeals();
    return {
      calories: todaysMeals.reduce((sum, m) => sum + m.calories, 0),
      protein: todaysMeals.reduce((sum, m) => sum + m.protein, 0),
      carbs: todaysMeals.reduce((sum, m) => sum + m.carbs, 0),
      fat: todaysMeals.reduce((sum, m) => sum + m.fat, 0),
      mealsCount: todaysMeals.length,
    };
  };

  const getCalorieProgress = () => {
    if (!profile) return 0;
    const { calories } = getTodaysNutrition();
    return Math.min((calories / profile.dailyCalorieGoal) * 100, 100);
  };

  const getWeeklyData = (): DailyLog[] => {
    const logs: DailyLog[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayMeals = meals.filter(m => new Date(m.timestamp).toDateString() === dateStr);
      
      logs.push({
        date: dateStr,
        meals: dayMeals,
        totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
        totalProtein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
        totalCarbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
        totalFat: dayMeals.reduce((sum, m) => sum + m.fat, 0),
      });
    }
    
    return logs;
  };

  return {
    profile,
    meals,
    setupProfile,
    updateProfile,
    addMeal,
    removeMeal,
    getTodaysMeals,
    getTodaysNutrition,
    getCalorieProgress,
    getWeeklyData,
  };
}
