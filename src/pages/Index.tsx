import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { HabitCard } from '@/components/HabitCard';
import { WeeklyChart } from '@/components/WeeklyChart';
import { AddHabitModal } from '@/components/AddHabitModal';
import { EditHabitModal } from '@/components/EditHabitModal';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types/habit';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const { 
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
  } = useHabits();

  const todayProgress = getTodayProgress();
  const weekProgress = getWeekProgress();
  const todaysHabits = getTodaysHabits();

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderHabits(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <div className="px-6 space-y-6">
        {/* Today's Progress */}
        <motion.div 
          className="flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ProgressRing percentage={todayProgress.percentage} />
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {todayProgress.completed}/{todayProgress.total}
            </p>
            <p className="text-sm text-muted-foreground">completed today</p>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeeklyChart data={weekProgress} />
        </motion.div>

        {/* Habits List */}
        <div>
          <h3 className="section-title">Today</h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {todaysHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                >
                  <HabitCard
                    habit={habit}
                    isCompleted={isCompletedToday(habit)}
                    streak={getStreak(habit)}
                    onToggle={() => toggleHabit(habit.id)}
                    onRemove={() => removeHabit(habit.id)}
                    onEdit={() => setEditingHabit(habit)}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    isDragging={draggedIndex === index}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {todaysHabits.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground text-sm">No habits scheduled for today</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="floating-btn"
        onClick={() => setIsModalOpen(true)}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={updateHabit}
      />
    </div>
  );
};

export default Index;
