import { DayProgress } from '@/types/habit';

interface WeeklyChartProps {
  data: DayProgress[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">This Week</h3>
      <div className="flex justify-between items-end gap-2">
        {data.map((day) => {
          const date = new Date(day.date);
          const dayName = dayNames[date.getDay()];
          const isToday = day.date === new Date().toISOString().split('T')[0];

          return (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <div className="h-16 w-full flex items-end justify-center mb-2">
                <div
                  className={`w-full max-w-[24px] rounded-sm transition-all ${
                    isToday ? 'bg-foreground' : 'bg-muted-foreground/40'
                  }`}
                  style={{ 
                    height: `${Math.max(day.percentage * 0.64, 4)}px`
                  }}
                />
              </div>
              <span className={`text-xs ${isToday ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
