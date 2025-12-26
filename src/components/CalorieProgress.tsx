import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';

interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

export function CalorieProgress({ consumed, goal }: CalorieProgressProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const isOverGoal = consumed >= goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Consumed</p>
            <p className="text-2xl font-bold text-foreground">{consumed} <span className="text-base font-normal text-muted-foreground">kcal</span></p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Target className="w-4 h-4" />
            <span>Goal</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{goal} kcal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            isOverGoal ? 'bg-primary' : 'bg-primary/70'
          }`}
        />
      </div>

      {/* Remaining */}
      <div className="mt-3 text-center">
        {isOverGoal ? (
          <p className="text-primary font-medium">🎉 Goal reached! Great job!</p>
        ) : (
          <p className="text-muted-foreground">
            <span className="text-foreground font-semibold">{remaining}</span> kcal remaining to reach your goal
          </p>
        )}
      </div>
    </motion.div>
  );
}
