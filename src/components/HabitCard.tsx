import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Trash2 } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onRemove: () => void;
}

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const HabitCard = ({ habit, isCompleted, streak, onToggle, onRemove }: HabitCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="habit-card flex items-center gap-4"
    >
      <button
        onClick={onToggle}
        className={`habit-checkbox flex-shrink-0 ${isCompleted ? 'checked' : ''}`}
      >
        <AnimatePresence mode="wait">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-3.5 h-3.5 text-background" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.emoji}</span>
          <span className={`font-medium text-sm transition-all ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {habit.name}
          </span>
        </div>
        <div className="flex gap-1 mt-1.5">
          {dayLabels.map((label, index) => (
            <span
              key={index}
              className={`text-[10px] w-4 text-center ${
                habit.scheduledDays.includes(index) 
                  ? 'text-muted-foreground' 
                  : 'text-muted-foreground/30'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {streak > 0 && (
        <div className="streak-badge">
          <Flame className="w-3 h-3" />
          <span>{streak}</span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
