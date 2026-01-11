import { motion } from 'framer-motion';

export const Header = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <motion.header 
      className="pt-14 pb-8 px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">{formattedDate}</p>
      <h1 className="text-2xl font-semibold text-foreground">Habits</h1>
    </motion.header>
  );
};
