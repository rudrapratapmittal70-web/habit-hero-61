import { useState, useEffect } from 'react';
import { Habit, DayProgress } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

const defaultHabits: Habit[] = [
  { id: '1', name: 'Drink Water', emoji: '💧', createdAt: new Date().toISOString(), completedDates: [] },
  { id: '2', name: 'Exercise', emoji: '🏃', createdAt: new Date().toISOString(), completedDates: [] },
  { id: '3', name: 'Read', emoji: '📚', createdAt: new Date().toISOString(), completedDates: [] },
  { id: '4', name: 'Meditate', emoji: '🧘', createdAt: new Date().toISOString(), completedDates: [] },
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultHabits;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const today = new Date().toISOString().split('T')[0];

  const toggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const isCompleted = habit.completedDates.includes(today);
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== today)
          : [...habit.completedDates, today]
      };
    }));
  };

  const addHabit = (name: string, emoji: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      emoji,
      createdAt: new Date().toISOString(),
      completedDates: []
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const getStreak = (habit: Habit): number => {
    const sortedDates = [...habit.completedDates].sort().reverse();
    let streak = 0;
    const checkDate = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // Allow today to be incomplete
        checkDate.setDate(checkDate.getDate() - 1);
        if (sortedDates.includes(checkDate.toISOString().split('T')[0])) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeekProgress = (): DayProgress[] => {
    const progress: DayProgress[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
      const total = habits.length;
      
      progress.push({
        date: dateStr,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    return progress;
  };

  const getTodayProgress = () => {
    const completed = habits.filter(h => h.completedDates.includes(today)).length;
    return {
      completed,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0
    };
  };

  const isCompletedToday = (habit: Habit) => habit.completedDates.includes(today);

  return {
    habits,
    toggleHabit,
    addHabit,
    removeHabit,
    getStreak,
    getWeekProgress,
    getTodayProgress,
    isCompletedToday
  };
};
