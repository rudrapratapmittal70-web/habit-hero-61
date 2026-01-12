import { useState, useEffect } from 'react';
import { Habit, DayProgress } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-data';

const defaultHabits: Habit[] = [
  { id: '1', name: 'Drink Water', emoji: '💧', createdAt: new Date().toISOString(), completedDates: [], scheduledDays: [0, 1, 2, 3, 4, 5, 6], order: 0 },
  { id: '2', name: 'Exercise', emoji: '🏃', createdAt: new Date().toISOString(), completedDates: [], scheduledDays: [1, 3, 5], order: 1 },
  { id: '3', name: 'Read', emoji: '📚', createdAt: new Date().toISOString(), completedDates: [], scheduledDays: [0, 1, 2, 3, 4, 5, 6], order: 2 },
  { id: '4', name: 'Meditate', emoji: '🧘', createdAt: new Date().toISOString(), completedDates: [], scheduledDays: [0, 1, 2, 3, 4, 5, 6], order: 3 },
];

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate old habits that don't have scheduledDays or order
      return parsed.map((h: Habit, index: number) => ({
        ...h,
        scheduledDays: h.scheduledDays ?? [0, 1, 2, 3, 4, 5, 6],
        order: h.order ?? index
      }));
    }
    return defaultHabits;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const today = new Date().toISOString().split('T')[0];
  const todayDayOfWeek = new Date().getDay();

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

  const addHabit = (name: string, emoji: string, scheduledDays: number[] = [0, 1, 2, 3, 4, 5, 6]) => {
    setHabits(prev => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        emoji,
        createdAt: new Date().toISOString(),
        completedDates: [],
        scheduledDays,
        order: prev.length
      };
      return [...prev, newHabit];
    });
  };

  const updateHabit = (id: string, updates: { name: string; emoji: string; scheduledDays: number[] }) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const reorderHabits = (fromIndex: number, toIndex: number) => {
    setHabits(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const [removed] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, removed);
      return sorted.map((habit, index) => ({ ...habit, order: index }));
    });
  };

  const removeHabit = (habitId: string) => {
    setHabits(prev => {
      const filtered = prev.filter(h => h.id !== habitId);
      return filtered.map((habit, index) => ({ ...habit, order: index }));
    });
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

  const getTodaysHabits = () => {
    return habits
      .filter(h => h.scheduledDays.includes(todayDayOfWeek))
      .sort((a, b) => a.order - b.order);
  };

  const getWeekProgress = (): DayProgress[] => {
    const progress: DayProgress[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      const scheduledHabits = habits.filter(h => h.scheduledDays.includes(dayOfWeek));
      const completed = scheduledHabits.filter(h => h.completedDates.includes(dateStr)).length;
      const total = scheduledHabits.length;
      
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
    const todaysHabits = getTodaysHabits();
    const completed = todaysHabits.filter(h => h.completedDates.includes(today)).length;
    return {
      completed,
      total: todaysHabits.length,
      percentage: todaysHabits.length > 0 ? Math.round((completed / todaysHabits.length) * 100) : 0
    };
  };

  const isCompletedToday = (habit: Habit) => habit.completedDates.includes(today);

  return {
    habits: habits.sort((a, b) => a.order - b.order),
    toggleHabit,
    addHabit,
    updateHabit,
    removeHabit,
    reorderHabits,
    getStreak,
    getWeekProgress,
    getTodayProgress,
    isCompletedToday,
    getTodaysHabits
  };
};
