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

export const HabitCard = ({ habit, isCompleted, streak, onToggle, onRemove }: HabitCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
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
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.emoji}</span>
          <span className={`font-medium transition-all duration-300 ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {habit.name}
          </span>
        </div>
      </div>

      {streak > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="streak-badge"
        >
          <Flame className="w-3 h-3" />
          <span>{streak}</span>
        </motion.div>
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
