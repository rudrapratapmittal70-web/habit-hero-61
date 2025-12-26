import { motion } from 'framer-motion';

interface MacrosChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacrosChart({ protein, carbs, fat }: MacrosChartProps) {
  const total = protein + carbs + fat;
  
  const proteinPercent = total > 0 ? (protein / total) * 100 : 33.33;
  const carbsPercent = total > 0 ? (carbs / total) * 100 : 33.33;
  const fatPercent = total > 0 ? (fat / total) * 100 : 33.33;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-5 shadow-card"
    >
      <h3 className="text-foreground font-semibold mb-4">Today's Macros</h3>

      {/* Macro Bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-secondary mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${proteinPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-primary h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${carbsPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="bg-streak h-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fatPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-progress h-full"
        />
      </div>

      {/* Macro Details */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{protein}g</p>
          <p className="text-muted-foreground text-xs">Protein</p>
          <p className="text-primary text-xs">{proteinPercent.toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-streak rounded-full mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{carbs}g</p>
          <p className="text-muted-foreground text-xs">Carbs</p>
          <p className="text-streak text-xs">{carbsPercent.toFixed(0)}%</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-progress rounded-full mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{fat}g</p>
          <p className="text-muted-foreground text-xs">Fat</p>
          <p className="text-progress text-xs">{fatPercent.toFixed(0)}%</p>
        </div>
      </div>
    </motion.div>
  );
}
