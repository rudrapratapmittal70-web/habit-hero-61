import { motion } from 'framer-motion';
import { Trash2, Utensils } from 'lucide-react';
import { Meal } from '@/types/nutrition';
import { format } from 'date-fns';

interface MealCardProps {
  meal: Meal;
  onRemove: (id: string) => void;
  index: number;
}

export function MealCard({ meal, onRemove, index }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3"
    >
      {meal.imageUrl ? (
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-14 h-14 object-cover rounded-xl"
        />
      ) : (
        <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
          <Utensils className="w-6 h-6 text-primary" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium capitalize truncate">{meal.name}</p>
        <p className="text-muted-foreground text-sm">
          {format(new Date(meal.timestamp), 'h:mm a')}
        </p>
        <div className="flex gap-2 mt-1 text-xs">
          <span className="text-primary">P: {meal.protein}g</span>
          <span className="text-streak">C: {meal.carbs}g</span>
          <span className="text-progress">F: {meal.fat}g</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-foreground">{meal.calories}</p>
        <p className="text-muted-foreground text-xs">kcal</p>
      </div>

      <button
        onClick={() => onRemove(meal.id)}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
