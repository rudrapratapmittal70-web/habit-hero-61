import { motion } from 'framer-motion';
import { DayProgress } from '@/types/habit';

interface WeeklyChartProps {
  data: DayProgress[];
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const maxHeight = 100;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="section-title">This Week</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((day, index) => {
          const date = new Date(day.date);
          const dayName = dayNames[date.getDay()];
          const isToday = day.date === new Date().toISOString().split('T')[0];
          const barHeight = (day.percentage / 100) * maxHeight;

          return (
            <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full h-24 flex items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  className={`w-full max-w-8 rounded-t-lg ${
                    isToday ? 'bg-primary' : 'bg-muted'
                  }`}
                />
                {day.percentage > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute -top-5 text-xs font-medium text-muted-foreground"
                  >
                    {day.percentage}%
                  </motion.span>
                )}
              </div>
              <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
