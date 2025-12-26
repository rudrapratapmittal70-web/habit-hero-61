export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completedDates: string[];
}

export interface DayProgress {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}
