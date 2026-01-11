export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  completedDates: string[];
  scheduledDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

export interface DayProgress {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}
