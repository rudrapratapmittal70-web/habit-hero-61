import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, emoji: string, scheduledDays: number[]) => void;
}

const emojiOptions = ['💧', '🏃', '📚', '🧘', '💪', '🥗', '😴', '📝', '🎯', '🌱', '🧠', '❤️'];
const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const AddHabitModal = ({ isOpen, onClose, onAdd }: AddHabitModalProps) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💧');
  const [scheduledDays, setScheduledDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (day: number) => {
    setScheduledDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && scheduledDays.length > 0) {
      onAdd(name.trim(), selectedEmoji, scheduledDays);
      setName('');
      setSelectedEmoji('💧');
      setScheduledDays([0, 1, 2, 3, 4, 5, 6]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">New Habit</h2>
              <button onClick={onClose} className="p-2 text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all border ${
                        selectedEmoji === emoji
                          ? 'bg-foreground/10 border-foreground'
                          : 'bg-muted border-transparent'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning walk"
                  className="h-11 bg-muted border-border"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                  Schedule
                </label>
                <div className="flex gap-2">
                  {dayLabels.map((label, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleDay(index)}
                      className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all border ${
                        scheduledDays.includes(index)
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-muted text-muted-foreground border-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-foreground text-background hover:bg-foreground/90" 
                disabled={!name.trim() || scheduledDays.length === 0}
              >
                Add Habit
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
