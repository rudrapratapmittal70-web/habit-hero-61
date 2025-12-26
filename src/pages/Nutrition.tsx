import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, ChevronLeft, UtensilsCrossed } from 'lucide-react';
import { useNutrition } from '@/hooks/useNutrition';
import { ProfileSetup } from '@/components/ProfileSetup';
import { CalorieProgress } from '@/components/CalorieProgress';
import { MacrosChart } from '@/components/MacrosChart';
import { MealCard } from '@/components/MealCard';
import { FoodScanner } from '@/components/FoodScanner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Nutrition() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const {
    profile,
    setupProfile,
    addMeal,
    removeMeal,
    getTodaysMeals,
    getTodaysNutrition,
  } = useNutrition();

  const todaysMeals = getTodaysMeals();
  const todaysNutrition = getTodaysNutrition();

  // Show setup if no profile
  if (!profile) {
    return <ProfileSetup onSetup={setupProfile} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Nutrition</h1>
              <p className="text-muted-foreground text-sm">Track your calories</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Daily Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-4 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Daily Goal for Weight Gain</p>
              <p className="text-2xl font-bold text-primary">{profile.dailyCalorieGoal} kcal</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Based on your profile: {profile.age}y, {profile.weight}kg, {profile.height}cm
          </p>
        </motion.div>

        {/* Calorie Progress */}
        <CalorieProgress 
          consumed={todaysNutrition.calories} 
          goal={profile.dailyCalorieGoal} 
        />

        {/* Macros Chart */}
        <MacrosChart 
          protein={todaysNutrition.protein}
          carbs={todaysNutrition.carbs}
          fat={todaysNutrition.fat}
        />

        {/* Today's Meals */}
        <div>
          <h2 className="section-title flex items-center justify-between">
            <span>Today's Meals</span>
            <span className="text-muted-foreground text-sm font-normal">
              {todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''}
            </span>
          </h2>

          <AnimatePresence>
            {todaysMeals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No meals logged yet today</p>
                <p className="text-muted-foreground text-sm">Tap the + button to add a meal</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {todaysMeals.map((meal, index) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    onRemove={removeMeal}
                    index={index}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsScannerOpen(true)}
        className="floating-btn"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      {/* Food Scanner Modal */}
      <FoodScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddMeal={addMeal}
      />
    </div>
  );
}
