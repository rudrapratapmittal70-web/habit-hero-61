import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { HabitCard } from '@/components/HabitCard';
import { WeeklyChart } from '@/components/WeeklyChart';
import { AddHabitModal } from '@/components/AddHabitModal';
import { useHabits } from '@/hooks/useHabits';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    habits, 
    toggleHabit, 
    addHabit, 
    removeHabit, 
    getStreak, 
    getWeekProgress, 
    getTodayProgress,
    isCompletedToday 
  } = useHabits();

  const todayProgress = getTodayProgress();
  const weekProgress = getWeekProgress();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <div className="px-4 space-y-6">
        {/* Navigation to Nutrition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/nutrition">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-4 flex items-center gap-4 border border-primary/20 transition-transform active:scale-[0.98]">
              <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-foreground font-semibold">Nutrition Tracker</p>
                <p className="text-muted-foreground text-sm">Track calories & macros</p>
              </div>
              <div className="text-primary text-2xl">→</div>
            </div>
          </Link>
        </motion.div>

        {/* Today's Progress */}
        <motion.div 
          className="bg-card rounded-2xl p-6 shadow-card flex items-center gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ProgressRing percentage={todayProgress.percentage} />
          <div>
            <p className="text-muted-foreground text-sm">Today's Progress</p>
            <p className="text-2xl font-bold text-foreground">
              {todayProgress.completed}/{todayProgress.total}
            </p>
            <p className="text-sm text-muted-foreground">habits completed</p>
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <WeeklyChart data={weekProgress} />
        </motion.div>

        {/* Habits List */}
        <div>
          <h3 className="section-title">Today's Habits</h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <HabitCard
                    habit={habit}
                    isCompleted={isCompletedToday(habit)}
                    streak={getStreak(habit)}
                    onToggle={() => toggleHabit(habit.id)}
                    onRemove={() => removeHabit(habit.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {habits.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground">No habits yet</p>
                <p className="text-sm text-muted-foreground">Tap + to add your first habit</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="floating-btn"
        onClick={() => setIsModalOpen(true)}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Index;