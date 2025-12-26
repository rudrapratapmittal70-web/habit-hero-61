import { motion } from 'framer-motion';

export const Header = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.header 
      className="pt-12 pb-6 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-muted-foreground text-sm mb-1">{formattedDate}</p>
      <h1 className="text-2xl font-bold text-foreground">{getGreeting()} ✨</h1>
    </motion.header>
  );
};
